import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.database import settings

logger = logging.getLogger("db_session")

def _init_engine():
    db_url = settings.DATABASE_URL or "sqlite:///./codepilot.db"

    # SQLite
    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False}
        )

    # PostgreSQL / Other
    try:
        # connect_timeout=3 prevents the server from freezing for 25s if DB is unreachable
        eng = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 3}
        )
        # Test connection immediately
        with eng.connect():
            pass
        return eng
    except Exception as e:
        logger.warning(f"Could not connect to database at {db_url}: {e}")
        # In local development or if localhost DB is not running, fall back to SQLite
        if "localhost" in db_url or "127.0.0.1" in db_url or settings.ENVIRONMENT == "development":
            sqlite_url = "sqlite:///./codepilot.db"
            logger.info(f"==> Falling back to local SQLite database: {sqlite_url}")
            return create_engine(
                sqlite_url,
                connect_args={"check_same_thread": False}
            )
        raise e

engine = _init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

