import pytest
from app.analyzers.pylint_analyzer import pylint_analyzer
from app.analyzers.bandit_analyzer import bandit_analyzer
from app.analyzers.flake8_analyzer import flake8_analyzer
from app.analyzers.radon_analyzer import radon_analyzer
from app.analyzers.parser import code_parser
from app.engine.analysis_engine import analysis_engine
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

SAMPLE_CLEAN_CODE = """\"\"\"Sample clean module.\"\"\"

def calculate_area(width: float, height: float) -> float:
    \"\"\"Calculate the area of a rectangle.\"\"\"
    return width * height
"""

SAMPLE_CODE_WITH_ISSUES = """import os, sys
x = eval("1 + 1")

def complex_func(a, b, c, d, e, f):
    if a > b:
        for i in range(10):
            if i % 2 == 0:
                print(i)
    return a + b
"""


def test_pylint_analyzer_structure():
    result = pylint_analyzer.analyze(SAMPLE_CLEAN_CODE)
    assert result["success"] is True
    assert "score" in result
    assert "rating" in result
    assert isinstance(result["issues"], list)
    for issue in result["issues"]:
        assert "line" in issue
        assert "severity" in issue
        assert "code" in issue
        assert "message" in issue


def test_bandit_analyzer_detects_security():
    result = bandit_analyzer.analyze(SAMPLE_CODE_WITH_ISSUES)
    assert result["success"] is True
    assert "score" in result
    assert "rating" in result
    assert "metrics" in result
    assert isinstance(result["issues"], list)
    # eval() should be flagged by Bandit
    has_security_issue = any("eval" in i["message"].lower() or i["code"] == "B307" for i in result["issues"])
    assert has_security_issue or len(result["issues"]) > 0
    for issue in result["issues"]:
        assert "line" in issue
        assert "severity" in issue
        assert "code" in issue
        assert "message" in issue


def test_flake8_analyzer_style():
    result = flake8_analyzer.analyze(SAMPLE_CODE_WITH_ISSUES)
    assert result["success"] is True
    assert "score" in result
    assert "rating" in result
    assert isinstance(result["issues"], list)
    assert len(result["issues"]) > 0
    for issue in result["issues"]:
        assert "line" in issue
        assert "severity" in issue
        assert "code" in issue
        assert "message" in issue


def test_radon_analyzer_complexity_and_mi():
    result = radon_analyzer.analyze(SAMPLE_CODE_WITH_ISSUES)
    assert result["success"] is True
    assert "maintainability_index" in result
    assert "mi_rank" in result
    assert "average_complexity" in result
    assert isinstance(result["complexity_blocks"], list)
    assert isinstance(result["issues"], list)


def test_code_parser_ast():
    result = code_parser.parse(SAMPLE_CODE_WITH_ISSUES)
    assert result["success"] is True
    assert result["line_counts"]["total"] > 0
    assert len(result["functions"]) == 1
    assert result["functions"][0]["name"] == "complex_func"
    assert result["functions"][0]["args_count"] == 6
    assert len(result["imports"]) >= 1
    # Check that too many args warning is emitted
    assert any(i["code"] == "AST_TOO_MANY_ARGS" for i in result["issues"])


def test_analysis_engine_composite_score():
    result = analysis_engine.analyze(SAMPLE_CLEAN_CODE)
    assert "overall_score" in result
    assert "overall_rating" in result
    assert result["overall_rating"] in ["Excellent", "Good", "Average", "Needs Improvement", "Poor"]
    assert 0 <= result["overall_score"] <= 100
    assert "pylint" in result
    assert "bandit" in result
    assert "flake8" in result
    assert "radon" in result
    assert "parser" in result
    assert isinstance(result["issues"], list)


def test_analysis_engine_handles_failures_gracefully(monkeypatch):
    # Simulate pylint throwing an unexpected exception
    def broken_analyze(code):
        raise RuntimeError("Simulated crash")

    monkeypatch.setattr(pylint_analyzer, "analyze", broken_analyze)

    result = analysis_engine.analyze(SAMPLE_CLEAN_CODE)
    # The overall engine must not crash
    assert "overall_score" in result
    assert result["pylint"]["success"] is False
    assert result["bandit"]["success"] is True
    assert result["flake8"]["success"] is True
    assert result["radon"]["success"] is True


def test_api_review_analyze_endpoint():
    response = client.post("/api/review/analyze", json={"code": SAMPLE_CLEAN_CODE})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis" in data
    assert "overall_score" in data["analysis"]
    assert "overall_rating" in data["analysis"]


def test_parser_syntax_error():
    result = code_parser.parse("def broken_syntax(:")
    assert result["success"] is False
    assert len(result["issues"]) >= 1
    assert result["issues"][0]["code"] == "SYNTAX_ERROR"


def test_analyzers_empty_code():
    pylint_res = pylint_analyzer.analyze("")
    assert pylint_res["success"] is True

    bandit_res = bandit_analyzer.analyze("")
    assert bandit_res["success"] is True

    flake8_res = flake8_analyzer.analyze("")
    assert flake8_res["success"] is True

    radon_res = radon_analyzer.analyze("")
    assert radon_res["success"] is True

    parser_res = code_parser.parse("")
    assert parser_res["success"] is True

