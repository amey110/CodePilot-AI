import os
import re
import sys
import subprocess
import tempfile
from typing import Dict, Any, List


class Flake8Analyzer:
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

            # Run flake8 with custom structured format
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "flake8",
                    "--format=%(row)d:%(col)d:%(code)s:%(text)s",
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

            for line in stdout.splitlines():
                line = line.strip()
                if not line:
                    continue

                # Format: row:col:code:text
                parts = line.split(":", 3)
                if len(parts) == 4:
                    row_str, _, code_id, text = parts
                    try:
                        line_no = int(row_str)
                    except ValueError:
                        line_no = 1

                    code_clean = code_id.strip()
                    # Flake8 codes starting with E or F are errors, W is warning, others info
                    if code_clean.startswith(("E", "F")):
                        severity = "error"
                    elif code_clean.startswith("W"):
                        severity = "warning"
                    else:
                        severity = "info"

                    issues.append({
                        "line": line_no,
                        "severity": severity,
                        "code": code_clean,
                        "message": text.strip()
                    })

            # Score calculation: 100 minus issue penalties
            error_count = sum(1 for i in issues if i["severity"] == "error")
            warn_count = sum(1 for i in issues if i["severity"] == "warning")
            info_count = sum(1 for i in issues if i["severity"] == "info")

            penalty = (error_count * 5.0) + (warn_count * 2.0) + (info_count * 1.0)
            score = max(0.0, min(100.0, 100.0 - penalty))

            return {
                "success": True,
                "score": round(score, 1),
                "rating": self.get_rating(score),
                "issues": issues
            }

        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "issues": [{
                    "line": 1,
                    "severity": "error",
                    "code": "TIMEOUT",
                    "message": f"Flake8 analysis timed out after {self.TIMEOUT_SECONDS}s."
                }]
            }

        except Exception as e:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
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


flake8_analyzer = Flake8Analyzer()
