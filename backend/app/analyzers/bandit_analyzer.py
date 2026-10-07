import os
import sys
import json
import subprocess
import tempfile
from typing import Dict, Any, List


class BanditAnalyzer:
    TIMEOUT_SECONDS = 15

    def analyze(self, code: str) -> Dict[str, Any]:
        temp_path = None

        try:
            if code:
                code = code.replace("\r\n", "\n").replace("\r", "\n")
                code = code.lstrip("\ufeff")

            with tempfile.NamedTemporaryFile(
                mode="w",
                suffix=".py",
                delete=False,
                encoding="utf-8",
                newline="\n"
            ) as temp:
                temp.write(code)
                temp.flush()
                temp_path = temp.name

            # Bandit exits with 1 if issues are found, so check=False
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "bandit",
                    "-f",
                    "json",
                    "-q",
                    temp_path
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=self.TIMEOUT_SECONDS
            )

            stdout = result.stdout or ""
            issues: List[Dict[str, Any]] = []
            high_count = 0
            medium_count = 0
            low_count = 0

            if stdout.strip():
                try:
                    data = json.loads(stdout)
                    raw_results = data.get("results", [])

                    for item in raw_results:
                        sev = str(item.get("issue_severity", "MEDIUM")).lower()
                        if sev == "high":
                            high_count += 1
                        elif sev == "medium":
                            medium_count += 1
                        else:
                            low_count += 1

                        issues.append({
                            "line": int(item.get("line_number", 1)),
                            "severity": sev,
                            "code": item.get("test_id", "B000"),
                            "message": item.get("issue_text", "Security issue detected.")
                        })
                except json.JSONDecodeError:
                    pass

            # Score calculation: 100 minus severity penalties
            penalty = (high_count * 25.0) + (medium_count * 10.0) + (low_count * 3.0)
            score = max(0.0, min(100.0, 100.0 - penalty))

            return {
                "success": True,
                "score": round(score, 1),
                "rating": self.get_rating(score),
                "metrics": {
                    "high_severity": high_count,
                    "medium_severity": medium_count,
                    "low_severity": low_count
                },
                "issues": issues
            }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "metrics": {"high_severity": 0, "medium_severity": 0, "low_severity": 0},
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "TIMEOUT",
                    "message": f"Bandit security analysis timed out after {self.TIMEOUT_SECONDS}s."
                }]
            }

        except Exception as e:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "metrics": {"high_severity": 0, "medium_severity": 0, "low_severity": 0},
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "ERROR",
                    "message": str(e)
                }]
            }

        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    pass

    def get_rating(self, score: float) -> str:
        if score >= 90:
            return "Excellent"
        elif score >= 80:
            return "Good"
        elif score >= 70:
            return "Average"
        elif score >= 50:
            return "Needs Improvement"
        return "Poor"


bandit_analyzer = BanditAnalyzer()
