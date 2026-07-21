from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

from app.config.database import settings
from app.database.session import engine, Base, get_db
from app.routers.auth import router as auth_router
from app.routers.review import router as review_router
from app.middleware.logging import LoggingMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app_main")

# Auto-create tables on startup (fallback if migrations are not run)
try:
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing database tables: {e}")

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered code review platform backend.",
    version="1.0.0"
)

# CORS Configuration
# In production, specify actual frontend origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://code-pilot-ai-beta.vercel.app",
]

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
