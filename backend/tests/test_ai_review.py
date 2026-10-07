import json
import pytest
from unittest.mock import MagicMock, patch
from google.api_core.exceptions import ResourceExhausted, GoogleAPIError

from app.ai.gemini_service import gemini_service, GeminiService
from app.config.database import settings
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

MOCK_AI_RESPONSE = {
    "summary": "This is a clean, well-tested Python function.",
    "bugs": ["Potential division by zero if divisor is 0."],
    "security_risks": ["No untrusted input sanitization."],
    "performance_tips": ["Use local variable caching for repeated lookups."],
    "readability_tips": ["Add type hints for return values."],
    "improved_code": "def divide(a: float, b: float) -> float:\n    if b == 0:\n        raise ValueError('Cannot divide by zero')\n    return a / b"
}


def test_build_prompt_truncation():
    long_code = "x = 1\n" * 10000  # > 50,000 chars
    prompt = gemini_service._build_prompt(long_code, {"overall_score": 85})
    assert "[Truncated" in prompt
    assert len(prompt) < 40000


def test_parse_json_response_clean():
    raw = json.dumps(MOCK_AI_RESPONSE)
    parsed = gemini_service._parse_json_response(raw)
    assert parsed is not None
    assert parsed["summary"] == MOCK_AI_RESPONSE["summary"]
    assert len(parsed["bugs"]) == 1
    assert parsed["improved_code"] == MOCK_AI_RESPONSE["improved_code"]


def test_parse_json_response_markdown_fenced():
    raw = f"```json\n{json.dumps(MOCK_AI_RESPONSE)}\n```"
    parsed = gemini_service._parse_json_response(raw)
    assert parsed is not None
    assert parsed["summary"] == MOCK_AI_RESPONSE["summary"]


def test_parse_json_response_invalid():
    raw = "Not a json response"
    parsed = gemini_service._parse_json_response(raw)
    assert parsed is None


def test_review_code_empty_input():
    result = gemini_service.review_code("")
    assert result["ai_review"] is None
    assert "No code provided" in result["message"]


def test_review_code_missing_api_key(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")
    svc = GeminiService()
    result = svc.review_code("x = 1")
    assert result["ai_review"] is None
    assert "not configured" in result["message"]


def test_review_code_success(monkeypatch):
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = json.dumps(MOCK_AI_RESPONSE)
    mock_model.generate_content.return_value = mock_response

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *args, **kwargs: mock_model)
    monkeypatch.setattr(gemini_service, "_configured", True)

    result = gemini_service.review_code("def add(a, b): return a + b")
    assert result["ai_review"] is not None
    assert result["ai_review"]["summary"] == MOCK_AI_RESPONSE["summary"]
    assert len(result["ai_review"]["bugs"]) == 1
    assert "improved_code" in result["ai_review"]


def test_review_code_quota_error(monkeypatch):
    mock_model = MagicMock()
    mock_model.generate_content.side_effect = ResourceExhausted("429 Quota Exceeded")

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *args, **kwargs: mock_model)
    monkeypatch.setattr(gemini_service, "_configured", True)

    result = gemini_service.review_code("x = 1")
    assert result["ai_review"] is None
    assert "quota exceeded" in result["message"].lower()


def test_review_code_api_error_fallback(monkeypatch):
    mock_model = MagicMock()
    mock_model.generate_content.side_effect = GoogleAPIError("Service Unavailable")

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *args, **kwargs: mock_model)
    monkeypatch.setattr(gemini_service, "_configured", True)

    result = gemini_service.review_code("x = 1")
    assert result["ai_review"] is None
    assert "error" in result["message"].lower()


def test_endpoint_returns_static_and_ai_review(monkeypatch):
    # Mock AI to return successfully during integration test
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = json.dumps(MOCK_AI_RESPONSE)
    mock_model.generate_content.return_value = mock_response

    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *args, **kwargs: mock_model)
    monkeypatch.setattr(gemini_service, "_configured", True)

    response = client.post("/api/review/analyze", json={"code": "x = 1\n"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data
    assert "overall_score" in data["analysis"]
    # Verify AI review payload is attached
    assert data["ai_review"] is not None
    assert data["ai_review"]["summary"] == MOCK_AI_RESPONSE["summary"]
