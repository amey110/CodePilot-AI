from typing import Dict, Any, List
import radon.complexity as cc
import radon.metrics as metrics


class RadonAnalyzer:

    def analyze(self, code: str) -> Dict[str, Any]:
        try:
            if not code or not code.strip():
                return {
                    "success": True,
                    "score": 100.0,
                    "rating": "Excellent",
                    "maintainability_index": 100.0,
                    "mi_rank": "A",
                    "average_complexity": 1.0,
                    "complexity_blocks": [],
                    "issues": []
                }

            # Normalize line endings
            clean_code = code.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")

            # Cyclomatic Complexity
            blocks = cc.cc_visit(clean_code)
            complexity_blocks: List[Dict[str, Any]] = []
            issues: List[Dict[str, Any]] = []

            for b in blocks:
                block_info = {
                    "name": getattr(b, "name", "unknown"),
                    "type": b.__class__.__name__,
                    "line": getattr(b, "lineno", 1),
                    "complexity": getattr(b, "complexity", 1),
                    "rank": getattr(b, "letter", "A")
                }
                complexity_blocks.append(block_info)

                # Flag high cyclomatic complexity (Rank C = 11-20, D = 21-30, etc.)
                if block_info["complexity"] > 10:
                    sev = "error" if block_info["complexity"] > 20 else "warning"
                    issues.append({
                        "line": block_info["line"],
                        "severity": sev,
                        "code": f"CC_{block_info['rank']}",
                        "message": (
                            f"High cyclomatic complexity in {block_info['name']} "
                            f"(CC={block_info['complexity']}, Rank={block_info['rank']})"
                        )
                    })

            # Maintainability Index
            mi = metrics.mi_visit(clean_code, multi=True)
            mi_rank = metrics.mi_rank(mi)

            if mi < 65:
                issues.append({
                    "line": 1,
                    "severity": "warning",
                    "code": "RADON_MI",
                    "message": f"Low maintainability index: {round(mi, 1)}/100 (Rank {mi_rank})"
                })

            # Calculate average complexity
            avg_cc = (
                sum(b["complexity"] for b in complexity_blocks) / len(complexity_blocks)
                if complexity_blocks
                else 1.0
            )

            # Score calculation based on MI and complexity penalty
            base_score = max(0.0, min(100.0, float(mi)))
            complexity_penalty = max(0.0, (avg_cc - 5.0) * 5.0)
            score = max(0.0, min(100.0, base_score - complexity_penalty))

            return {
                "success": True,
                "score": round(score, 1),
                "rating": self.get_rating(score),
                "maintainability_index": round(mi, 2),
                "mi_rank": mi_rank,
                "average_complexity": round(avg_cc, 2),
                "complexity_blocks": complexity_blocks,
                "issues": issues
            }

        except SyntaxError as e:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "maintainability_index": 0.0,
                "mi_rank": "F",
                "average_complexity": 0.0,
                "complexity_blocks": [],
                "issues": [{
                    "line": e.lineno or 1,
                    "severity": "error",
                    "code": "SYNTAX_ERROR",
                    "message": f"Syntax error preventing complexity analysis: {e.msg}"
                }]
            }

        except Exception as e:
            return {
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
                    "code": "ERROR",
                    "message": str(e)
                }]
            }

    def get_rating(self, score: float) -> str:
        if score >= 85:
            return "Excellent"
        elif score >= 75:
            return "Good"
        elif score >= 60:
            return "Average"
        elif score >= 45:
            return "Needs Improvement"
        return "Poor"


radon_analyzer = RadonAnalyzer()
