from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    """
    Test that the root endpoint is accessible and returns the expected app tagline.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "AI-powered" in response.json()["tagline"]

def test_health_check():
    """
    Test that the health check endpoint executes successfully.
    """
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["healthy", "unhealthy"]

def test_register_validation():
    """
    Test that invalid registration data returns a 422 validation error.
    """
    # Missing fields
    response = client.post("/api/auth/register", json={"email": "not-an-email"})
    assert response.status_code == 422
