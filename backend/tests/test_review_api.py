import io
import json
from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.review import Review
from app.ai.gemini_service import gemini_service

client = TestClient(app)

MOCK_AI_RESPONSE = {
    "summary": "Sample test code looks reasonable.",
    "bugs": [],
    "security_risks": [],
    "performance_tips": [],
    "readability_tips": ["Add type hints"],
    "improved_code": "def hello() -> str:\n    return 'world'\n",
}


@pytest.fixture(autouse=True)
def mock_gemini(monkeypatch):
    """Mock Gemini API so tests run fast and offline."""
    mock_model = MagicMock()
    mock_resp = MagicMock()
    mock_resp.text = json.dumps(MOCK_AI_RESPONSE)
    mock_model.generate_content.return_value = mock_resp
    monkeypatch.setattr("google.generativeai.GenerativeModel", lambda *a, **kw: mock_model)
    monkeypatch.setattr(gemini_service, "_configured", True)


def test_analyze_creates_and_saves_review(db_session):
    response = client.post("/api/review/analyze", json={"code": "def hello():\n    return 'world'\n"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "review_id" in data
    assert data["review_id"] is not None

    # Verify review was persisted to SQLite database
    db_review = db_session.query(Review).filter(Review.id == data["review_id"]).first()
    assert db_review is not None
    assert db_review.user_id == 1
    assert "def hello():" in db_review.code
    assert db_review.score is not None
    assert db_review.rating is not None


def test_upload_creates_and_saves_review(db_session):
    py_code = b"def calculate(a, b):\n    return a + b\n"
    file_payload = ("test_calc.py", io.BytesIO(py_code), "text/x-python")

    response = client.post("/api/review/upload", files={"file": file_payload})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["filename"] == "test_calc.py"
    assert "review_id" in data

    db_review = db_session.query(Review).filter(Review.id == data["review_id"]).first()
    assert db_review is not None
    assert db_review.filename == "test_calc.py"


def test_history_pagination():
    # Fetch paginated history
    response = client.get("/api/review/history?page=1&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "page" in data
    assert data["page"] == 1
    assert "page_size" in data
    assert data["page_size"] == 2
    assert "total" in data
    assert "total_pages" in data
    assert isinstance(data["reviews"], list)
    assert len(data["reviews"]) <= 2


def test_get_single_review_and_report():
    # 1. Create a review
    res = client.post("/api/review/analyze", json={"code": "x = 42\n"})
    review_id = res.json()["review_id"]

    # 2. Get single review
    get_res = client.get(f"/api/review/{review_id}")
    assert get_res.status_code == 200
    single_data = get_res.json()
    assert single_data["success"] is True
    assert single_data["review"]["id"] == review_id
    assert single_data["review"]["analysis"] is not None

    # 3. Download JSON report
    report_res = client.get(f"/api/review/{review_id}/report")
    assert report_res.status_code == 200
    assert "application/json" in report_res.headers["content-type"]
    assert "attachment;" in report_res.headers["content-disposition"]
    report_json = report_res.json()
    assert report_json["id"] == review_id


def test_delete_review():
    # Create review
    res = client.post("/api/review/analyze", json={"code": "val = 100\n"})
    review_id = res.json()["review_id"]

    # Delete it
    del_res = client.delete(f"/api/review/{review_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Now fetching it returns 404
    get_res = client.get(f"/api/review/{review_id}")
    assert get_res.status_code == 404


def test_stats_endpoint():
    response = client.get("/api/review/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "total_reviews" in data
    assert "average_score" in data
    assert "total_issues" in data
    assert data["total_reviews"] >= 1


def test_user_isolation(db_session):
    # Review created by user 1
    res = client.post("/api/review/analyze", json={"code": "user1_code = True\n"})
    review_id = res.json()["review_id"]

    # Switch current user to User 2
    user2 = db_session.query(User).filter(User.id == 2).first()
    app.dependency_overrides[get_current_user] = lambda: user2

    try:
        # User 2 tries to access User 1's review -> 404
        get_res = client.get(f"/api/review/{review_id}")
        assert get_res.status_code == 404

        # User 2 tries to delete User 1's review -> 404
        del_res = client.delete(f"/api/review/{review_id}")
        assert del_res.status_code == 404

        # User 2 tries to download User 1's report -> 404
        rep_res = client.get(f"/api/review/{review_id}/report")
        assert rep_res.status_code == 404
    finally:
        # Restore user 1 override
        from tests.conftest import get_test_user
        app.dependency_overrides[get_current_user] = get_test_user


def test_unauthenticated_review_routes_rejected():
    # Remove user override to test unauthenticated access
    app.dependency_overrides.pop(get_current_user, None)

    try:
        res1 = client.get("/api/review/history")
        assert res1.status_code == 401

        res2 = client.get("/api/review/stats")
        assert res2.status_code == 401

        res3 = client.get("/api/review/1")
        assert res3.status_code == 401

        res4 = client.post("/api/review/analyze", json={"code": "x = 1"})
        assert res4.status_code == 401
    finally:
        from tests.conftest import get_test_user
        app.dependency_overrides[get_current_user] = get_test_user
