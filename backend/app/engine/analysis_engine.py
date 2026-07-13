from app.analyzers.pylint_analyzer import pylint_analyzer


class AnalysisEngine:

    def analyze(self, code: str):

        pylint_result = pylint_analyzer.analyze(code)

        return {
            "pylint": pylint_result
        }


analysis_engine = AnalysisEngine()