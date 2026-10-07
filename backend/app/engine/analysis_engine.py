import logging
from typing import Dict, Any, List

from app.analyzers.pylint_analyzer import pylint_analyzer
from app.analyzers.bandit_analyzer import bandit_analyzer
from app.analyzers.flake8_analyzer import flake8_analyzer
from app.analyzers.radon_analyzer import radon_analyzer
from app.analyzers.parser import code_parser

logger = logging.getLogger("analysis_engine")


class AnalysisEngine:

    def analyze(self, code: str) -> Dict[str, Any]:
        """
        Executes all static code analyzers independently, isolating failures so
        one analyzer error does not break the entire pipeline, and calculates
        an overall weighted quality score and rating.
        """
        # 1. Pylint Analysis
        try:
            pylint_result = pylint_analyzer.analyze(code)
        except Exception as e:
            logger.error(f"Pylint analyzer failed: {e}", exc_info=True)
            pylint_result = {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "PYLINT_ERROR",
                    "message": f"Pylint execution error: {str(e)}"
                }]
            }

        # 2. Bandit Security Analysis
        try:
            bandit_result = bandit_analyzer.analyze(code)
        except Exception as e:
            logger.error(f"Bandit analyzer failed: {e}", exc_info=True)
            bandit_result = {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "metrics": {"high_severity": 0, "medium_severity": 0, "low_severity": 0},
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "BANDIT_ERROR",
                    "message": f"Bandit execution error: {str(e)}"
                }]
            }

        # 3. Flake8 Style Analysis
        try:
            flake8_result = flake8_analyzer.analyze(code)
        except Exception as e:
            logger.error(f"Flake8 analyzer failed: {e}", exc_info=True)
            flake8_result = {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "FLAKE8_ERROR",
                    "message": f"Flake8 execution error: {str(e)}"
                }]
            }

        # 4. Radon Complexity & Maintainability Analysis
        try:
            radon_result = radon_analyzer.analyze(code)
        except Exception as e:
            logger.error(f"Radon analyzer failed: {e}", exc_info=True)
            radon_result = {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "maintainability_index": 0.0,
                "mi_rank": "F",
                "average_complexity": 0.0,
                "complexity_blocks": [],
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "RADON_ERROR",
                    "message": f"Radon execution error: {str(e)}"
                }]
            }

        # 5. AST Parsing & Structure Analysis
        try:
            parser_result = code_parser.parse(code)
        except Exception as e:
            logger.error(f"AST parser failed: {e}", exc_info=True)
            parser_result = {
                "success": False,
                "line_counts": {"total": len(code.splitlines()) if code else 0, "code": 0, "comment": 0, "blank": 0},
                "functions": [],
                "classes": [],
                "imports": [],
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "PARSER_ERROR",
                    "message": f"AST parser error: {str(e)}"
                }]
            }

        # Aggregate all issues across analyzers
        all_issues: List[Dict[str, Any]] = []
        for source_name, res in [
            ("pylint", pylint_result),
            ("bandit", bandit_result),
            ("flake8", flake8_result),
            ("radon", radon_result),
            ("ast", parser_result),
        ]:
            for issue in res.get("issues", []):
                item = dict(issue)
                item["source"] = source_name
                all_issues.append(item)

        # Sort issues by line number and severity
        severity_order = {"fatal": 0, "high": 0, "error": 1, "medium": 2, "warning": 3, "convention": 4, "refactor": 4, "info": 5, "low": 5}
        all_issues.sort(key=lambda x: (x.get("line") or 1, severity_order.get(x.get("severity", "info").lower(), 6)))

        # Calculate Overall Composite Score (0 - 100)
        # Weights: Bandit (Security) 30%, Pylint (Quality) 30%, Flake8 (Style) 20%, Radon (Maintainability) 20%
        analyzers_config = [
            ("bandit", bandit_result, bandit_result.get("score", 0.0), 0.30),
            ("pylint", pylint_result, max(0.0, min(100.0, pylint_result.get("score", 0.0) * 10.0)), 0.30),
            ("flake8", flake8_result, flake8_result.get("score", 0.0), 0.20),
            ("radon", radon_result, radon_result.get("score", 0.0), 0.20),
        ]

        total_weight = 0.0
        weighted_sum = 0.0

        for _, result_obj, score_val, weight in analyzers_config:
            if result_obj.get("success", False):
                weighted_sum += score_val * weight
                total_weight += weight

        if total_weight > 0:
            overall_score = round(weighted_sum / total_weight, 1)
        else:
            overall_score = 0.0

        overall_rating = self.calculate_rating(overall_score)

        return {
            "overall_score": overall_score,
            "overall_rating": overall_rating,
            "summary": {
                "pylint_score": pylint_result.get("score", 0.0),
                "bandit_score": bandit_result.get("score", 0.0),
                "flake8_score": flake8_result.get("score", 0.0),
                "radon_score": radon_result.get("score", 0.0),
                "maintainability_index": radon_result.get("maintainability_index", 100.0),
                "total_issues": len(all_issues),
                "total_lines": parser_result.get("line_counts", {}).get("total", len(code.splitlines()) if code else 0),
            },
            "pylint": pylint_result,
            "bandit": bandit_result,
            "flake8": flake8_result,
            "radon": radon_result,
            "parser": parser_result,
            "issues": all_issues
        }

    def calculate_rating(self, score: float) -> str:
        if score >= 90.0:
            return "Excellent"
        elif score >= 80.0:
            return "Good"
        elif score >= 70.0:
            return "Average"
        elif score >= 50.0:
            return "Needs Improvement"
        return "Poor"


analysis_engine = AnalysisEngine()