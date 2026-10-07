import os
import re
import sys
import subprocess
import tempfile
from typing import Dict, Any, List


class PylintAnalyzer:
    TIMEOUT_SECONDS = 15

    def analyze(self, code: str) -> Dict[str, Any]:
        temp_path = None

        try:
            # Normalize line endings and strip BOM
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

            # Run pylint using current python interpreter (works on Windows, Linux, and Docker)
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "pylint",
                    temp_path,
                    "--score=y",
                    "--msg-template={line}:{column}:{msg_id}:{category}:{msg}"
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=self.TIMEOUT_SECONDS
            )

            output = (result.stdout or "") + "\n" + (result.stderr or "")

            # Extract pylint score
            score = 0.0
            score_match = re.search(r"rated at\s+([-\d\.]+)/10", output)
            if score_match:
                try:
                    score = max(0.0, float(score_match.group(1)))
                except ValueError:
                    score = 0.0

            # Extract structured issues
            issues: List[Dict[str, Any]] = []

            for line in output.splitlines():
                line = line.strip()
                if not line:
                    continue

                # Template match: {line}:{column}:{msg_id}:{category}:{msg}
                template_match = re.match(r"^(\d+):(\d+):([A-Z0-9]+):([a-zA-Z_-]+):(.*)$", line)
                if template_match:
                    issues.append({
                        "line": int(template_match.group(1)),
                        "severity": template_match.group(4).lower(),
                        "code": template_match.group(3),
                        "message": template_match.group(5).strip()
                    })
                    continue

                # Fallback standard match: file.py:1:0: C0114: Missing module docstring
                fallback_match = re.search(r":(\d+):(\d+):\s*([A-Z0-9]+):\s*(.*)$", line)
                if fallback_match:
                    code_id = fallback_match.group(3)
                    sev_char = code_id[0] if code_id else "C"
                    sev_map = {
                        "F": "fatal",
                        "E": "error",
                        "W": "warning",
                        "R": "refactor",
                        "C": "convention"
                    }
                    issues.append({
                        "line": int(fallback_match.group(1)),
                        "severity": sev_map.get(sev_char, "warning"),
                        "code": code_id,
                        "message": fallback_match.group(4).strip()
                    })

            return {
                "success": True,
                "score": score,
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
                    "message": f"Pylint analysis timed out after {self.TIMEOUT_SECONDS}s."
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
        if score >= 9:
            return "Excellent"
        elif score >= 8:
            return "Good"
        elif score >= 7:
            return "Average"
        elif score >= 5:
            return "Needs Improvement"
        return "Poor"


pylint_analyzer = PylintAnalyzer()