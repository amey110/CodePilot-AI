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

def test_login_wrong_email():
    """
    Test that logging in with an unregistered email returns 401 with 'Wrong Email ID'.
    """
    response = client.post("/api/auth/login", json={
        "email": "nonexistent_user_999@example.com",
        "password": "anyPassword123!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Wrong Email ID"

def test_login_wrong_password():
    """
    Test that logging in with valid email but wrong password returns 401 with 'Wrong Password'.
    """
    response = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Wrong Password"

def test_login_success():
    """
    Test that logging in with valid credentials returns 200 with an access token.
    """
    response = client.post("/api/auth/login", json={
        "email": "testuser@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_logout_endpoint():
    """
    Test that the logout endpoint always responds successfully without throwing 401.
    """
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert "Successfully logged out" in response.json()["message"]
