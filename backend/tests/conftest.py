import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database.session import Base, get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.review import Review  # noqa: F401
from app.core.security import get_password_hash
from app.main import app

# In-memory SQLite for test execution
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create all database tables in memory
Base.metadata.create_all(bind=test_engine)


def get_test_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Seed test database with default users for testing."""
    db = TestingSessionLocal()
    # Check if test user already exists
    user1 = db.query(User).filter(User.id == 1).first()
    if not user1:
        user1 = User(
            id=1,
            full_name="Test User",
            email="testuser@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=True,
        )
        db.add(user1)

    user2 = db.query(User).filter(User.id == 2).first()
    if not user2:
        user2 = User(
            id=2,
            full_name="Other User",
            email="otheruser@example.com",
            hashed_password=get_password_hash("password456"),
            is_active=True,
        )
        db.add(user2)

    db.commit()
    db.close()
    yield


def get_test_user():
    db = TestingSessionLocal()
    try:
        return db.query(User).filter(User.id == 1).first()
    finally:
        db.close()


# Set default overrides on app so existing tests have db + user context
app.dependency_overrides[get_db] = get_test_db
app.dependency_overrides[get_current_user] = get_test_user


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    return TestClient(app)
