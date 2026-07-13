import os
import re
import subprocess
import tempfile


class PylintAnalyzer:

    def analyze(self, code: str):

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8"
        ) as temp:

            temp.write(code)
            temp_path = temp.name

        try:

            result = subprocess.run(
                [
                    "py",
                    "-m",
                    "pylint",
                    temp_path,
                    "--score=y"
                ],
                capture_output=True,
                text=True
            )

            output = result.stdout

            # Extract score
            score = 0.0

            match = re.search(
                r"rated at ([\d\.]+)/10",
                output
            )

            if match:
                score = float(match.group(1))

            # Extract issues
            issues = []

            for line in output.splitlines():

                if ":" in line and line.startswith(("C", "W", "E", "R")):
                    parts = line.split(":", 1)

                    if len(parts) > 1:
                        issues.append(parts[1].strip())

            return {

                "success": True,

                "score": score,

                "rating": self.get_rating(score),

                "issues": issues

            }

        finally:

            if os.path.exists(temp_path):
                os.remove(temp_path)

    def get_rating(self, score):

        if score >= 9:
            return "Excellent"

        if score >= 8:
            return "Good"

        if score >= 7:
            return "Average"

        if score >= 5:
            return "Needs Improvement"

        return "Poor"


pylint_analyzer = PylintAnalyzer()