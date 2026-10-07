import json
import logging
import re
from typing import Dict, Any, Optional

from app.config.database import settings

logger = logging.getLogger("gemini_service")


class GeminiService:
    MAX_CODE_CHARS = 25000  # Cap code length to prevent token overflow
    TIMEOUT_SECONDS = 30
    PREFERRED_MODELS = [
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
    ]

    def __init__(self):
        self._configured = False

    def _configure_client(self) -> bool:
        api_key = settings.GEMINI_API_KEY
        if not api_key or not api_key.strip():
            logger.warning("GEMINI_API_KEY is not configured.")
            return False

        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key.strip())
            self._configured = True
            return True
        except Exception as e:
            logger.error(f"Failed to configure Gemini client: {e}")
            return False

    def review_code(
        self,
        code: str,
        analyzer_results: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Sends the Python code and static analyzer results to Google Gemini AI.
        Returns strict JSON containing summary, bugs, security_risks,
        performance_tips, readability_tips, and improved_code.

        Gracefully degrades with ai_review = None and a clear message on any failure.
        """
        if not code or not code.strip():
            return {
                "ai_review": None,
                "message": "No code provided for AI review."
            }

        # Check API key configuration
        if not settings.GEMINI_API_KEY or not settings.GEMINI_API_KEY.strip():
            return {
                "ai_review": None,
                "message": "Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env"
            }

        if not self._configured and not self._configure_client():
            return {
                "ai_review": None,
                "message": "Failed to initialize Gemini AI client."
            }

        prompt = self._build_prompt(code, analyzer_results)

        import google.generativeai as genai
        from google.api_core.exceptions import ResourceExhausted, GoogleAPIError

        last_error_msg = ""
        # Try preferred models in order
        for model_name in self.PREFERRED_MODELS:
            try:
                model = genai.GenerativeModel(
                    model_name,
                    generation_config={
                        "response_mime_type": "application/json",
                        "temperature": 0.2,
                    }
                )

                response = model.generate_content(
                    prompt,
                    request_options={"timeout": self.TIMEOUT_SECONDS}
                )

                raw_text = response.text or ""
                parsed_json = self._parse_json_response(raw_text)

                if parsed_json:
                    return {
                        "ai_review": parsed_json,
                        "message": "AI code review generated successfully."
                    }

            except ResourceExhausted:
                logger.warning(f"Gemini quota exhausted on model {model_name}.")
                return {
                    "ai_review": None,
                    "message": "Gemini API quota exceeded or rate limit reached. Please try again later."
                }

            except GoogleAPIError as e:
                logger.warning(f"Gemini API error on model {model_name}: {e}")
                last_error_msg = f"Gemini API error: {e.message if hasattr(e, 'message') else str(e)}"
                continue

            except Exception as e:
                logger.warning(f"Unexpected error with model {model_name}: {e}")
                last_error_msg = f"AI review error: {str(e)}"
                continue

        return {
            "ai_review": None,
            "message": last_error_msg or "AI review unavailable due to server error."
        }

    def _build_prompt(
        self,
        code: str,
        analyzer_results: Optional[Dict[str, Any]] = None
    ) -> str:
        # Enforce code character limit
        is_truncated = len(code) > self.MAX_CODE_CHARS
        bounded_code = code[:self.MAX_CODE_CHARS]
        if is_truncated:
            bounded_code += "\n# ... [Truncated: Code exceeds size limit for AI review]"

        # Format analyzer summary
        analyzer_section = ""
        if analyzer_results:
            summary_info = analyzer_results.get("summary", {})
            issues_list = analyzer_results.get("issues", [])[:15]
            formatted_issues = []
            for issue in issues_list:
                line = issue.get("line", "?")
                code_tag = issue.get("code", "")
                sev = issue.get("severity", "warning")
                msg = issue.get("message", "")
                formatted_issues.append(f"- Line {line} [{code_tag}] ({sev}): {msg}")

            analyzer_section = f"""
Static Analysis Findings:
- Overall Score: {analyzer_results.get('overall_score', 'N/A')}/100 ({analyzer_results.get('overall_rating', 'N/A')})
- Pylint: {summary_info.get('pylint_score', 'N/A')}/10
- Security (Bandit): {summary_info.get('bandit_score', 'N/A')}/100
- Style (Flake8): {summary_info.get('flake8_score', 'N/A')}/100
- Maintainability (Radon): {summary_info.get('maintainability_index', 'N/A')}/100
- Detected Issues:
{chr(10).join(formatted_issues) if formatted_issues else "No static issues detected."}
"""

        return f"""You are an expert Python software engineer, security specialist, and code reviewer.
Review the following Python code alongside the static analysis findings.

Respond ONLY with a valid JSON object matching EXACTLY this JSON structure:
{{
  "summary": "A concise executive summary evaluating code quality, architecture, and primary risks.",
  "bugs": ["Specific logical bugs, edge cases, exception vulnerabilities, or runtime defects"],
  "security_risks": ["Specific security vulnerabilities (e.g. injection, unsafe deserialization, hardcoded secrets)"],
  "performance_tips": ["Concrete performance bottlenecks and optimization recommendations"],
  "readability_tips": ["Clean code practices, PEP 8 styling, and structural maintainability improvements"],
  "improved_code": "The complete, refactored, production-ready Python code incorporating all fixes and best practices."
}}

{analyzer_section}

Code to Review:
```python
{bounded_code}
```
"""

    def _parse_json_response(self, text: str) -> Optional[Dict[str, Any]]:
        if not text or not text.strip():
            return None

        clean_text = text.strip()

        # Remove markdown fences if present
        if clean_text.startswith("```"):
            clean_text = re.sub(r"^```(?:json)?\s*", "", clean_text)
            clean_text = re.sub(r"\s*```$", "", clean_text)
            clean_text = clean_text.strip()

        try:
            data = json.loads(clean_text)
        except json.JSONDecodeError:
            # Fallback regex extraction of outermost JSON object
            match = re.search(r"(\{.*\})", clean_text, re.DOTALL)
            if match:
                try:
                    data = json.loads(match.group(1))
                except json.JSONDecodeError:
                    return None
            else:
                return None

        if not isinstance(data, dict):
            return None

        # Guarantee expected schema fields with appropriate default types
        return {
            "summary": str(data.get("summary", "Code reviewed successfully.")),
            "bugs": list(data.get("bugs", [])) if isinstance(data.get("bugs"), list) else [],
            "security_risks": list(data.get("security_risks", [])) if isinstance(data.get("security_risks"), list) else [],
            "performance_tips": list(data.get("performance_tips", [])) if isinstance(data.get("performance_tips"), list) else [],
            "readability_tips": list(data.get("readability_tips", [])) if isinstance(data.get("readability_tips"), list) else [],
            "improved_code": str(data.get("improved_code", ""))
        }


gemini_service = GeminiService()
