from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging

from app.config.database import settings
from app.database.session import engine, Base, get_db
from app.routers.auth import router as auth_router
from app.routers.review import router as review_router
from app.routers.users import router as users_router
from app.middleware.logging import LoggingMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app_main")

# Import all models so Base.metadata knows about them
import app.models  # noqa: F401

# Auto-create tables on startup (fallback if migrations are not run)
try:
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

# ---------------------------------------------------------------------------
# Rate limiter (slowapi) — shared instance used in routers
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered code review platform backend.",
    version="1.0.0"
)

# Attach rate-limit state and exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — origins come from CORS_ORIGINS env variable (comma-separated)
# ---------------------------------------------------------------------------
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Custom Logging Middleware
app.add_middleware(LoggingMiddleware)

# Mount API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(review_router, prefix="/api")
app.include_router(users_router, prefix="/api")


# Root API endpoint
@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    """
    Welcome endpoint returning basic API metadata.
    """
    return {
        "app": settings.PROJECT_NAME,
        "tagline": "AI-powered code review platform for developers.",
        "version": "1.0.0",
        "status": "healthy"
    }


# Health Check endpoint
@app.get("/api/health", status_code=status.HTTP_200_OK)
def health_check(db: Session = Depends(get_db)):
    """
    Verify API health and database connectivity.
    """
    try:
        # Simple query to check database responsiveness
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "disconnected"
        
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "services": {
            "api": "up",
            "database": db_status
        }
    }
