import os
import re
import subprocess
import tempfile


class PylintAnalyzer:

    def analyze(self, code: str):
        temp_path = None

        try:
            # Normalize line endings and remove UTF-8 BOM
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

            result = subprocess.run(
                [
                    "py",
                    "-m",
                    "pylint",
                    temp_path,
                    "--score=y"
                ],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace"
            )

            # Read both stdout and stderr
            output = result.stdout + "\n" + result.stderr

            # Extract pylint score
            score = 0.0

            match = re.search(
                r"rated at\s+([-\d\.]+)/10",
                output
            )

            if match:
                try:
                    score = float(match.group(1))
                except ValueError:
                    score = 0.0

            # Extract pylint issues
            issues = []

            for line in output.splitlines():
                line = line.strip()

                if not line:
                    continue

                # Matches:
                # file.py:1:0: C0114: Missing module docstring
                if re.search(r":[0-9]+:[0-9]+:", line):
                    issues.append(line)

            return {
                "success": True,
                "score": score,
                "rating": self.get_rating(score),
                "issues": issues
            }

        except Exception as e:
            return {
                "success": False,
                "score": 0.0,
                "rating": "Poor",
                "issues": [str(e)]
            }

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    def get_rating(self, score):

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