import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.core.security import verify_password

client = TestClient(app)


def test_update_profile_success(db_session):
    response = client.put("/api/users/profile", json={"full_name": "Updated Engineer"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["full_name"] == "Updated Engineer"

    # Verify update in database
    user = db_session.query(User).filter(User.id == 1).first()
    assert user.full_name == "Updated Engineer"


def test_update_profile_validation():
    # Empty full_name
    response = client.put("/api/users/profile", json={"full_name": ""})
    assert response.status_code == 422


def test_change_password_success(db_session):
    response = client.post(
        "/api/users/change-password",
        json={"current_password": "password123", "new_password": "new_super_secure_password"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True

    # Verify new password in database
    user = db_session.query(User).filter(User.id == 1).first()
    assert verify_password("new_super_secure_password", user.hashed_password) is True


def test_change_password_invalid_current():
    response = client.post(
        "/api/users/change-password",
        json={"current_password": "wrong_password", "new_password": "another_new_password"},
    )
    assert response.status_code == 400
    assert "incorrect" in response.json()["detail"].lower()


def test_change_password_same_as_current():
    # Reset/verify password is new_super_secure_password
    response = client.post(
        "/api/users/change-password",
        json={
            "current_password": "new_super_secure_password",
            "new_password": "new_super_secure_password",
        },
    )
    assert response.status_code == 400
    assert "differ" in response.json()["detail"].lower()


def test_users_endpoints_unauthenticated():
    app.dependency_overrides.pop(get_current_user, None)
    try:
        res1 = client.put("/api/users/profile", json={"full_name": "Ghost"})
        assert res1.status_code == 401

        res2 = client.post(
            "/api/users/change-password",
            json={"current_password": "pass", "new_password": "new_pass_123"},
        )
        assert res2.status_code == 401
    finally:
        from tests.conftest import get_test_user
        app.dependency_overrides[get_current_user] = get_test_user
