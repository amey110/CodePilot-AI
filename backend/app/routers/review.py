"""
Review router — all routes protected by get_current_user.

Endpoints
---------
POST   /api/review/analyze          Analyze pasted code (rate-limited)
POST   /api/review/upload           Analyze uploaded .py file (rate-limited)
GET    /api/review/history          Paginated review history for current user
GET    /api/review/stats            Aggregate stats for current user
GET    /api/review/{id}             Get a single review
DELETE /api/review/{id}             Delete a review
GET    /api/review/{id}/report      Download review as JSON
"""

from fastapi import APIRouter, Depends, UploadFile, File, Request, Query, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.review_service import review_service
from app.database.repository import review_repository
from app.schemas.review import CodeReviewRequest

# Router-local limiter instance (shares same key function as app limiter)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/review", tags=["Code Review"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _review_or_404(db: Session, review_id: int, user_id: int):
    """Return review if it belongs to the user, else raise 404."""
    review = review_repository.get(db, review_id=review_id, user_id=user_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found.",
        )
    return review


# ---------------------------------------------------------------------------
# Analysis endpoints (rate-limited: 10 per minute per IP)
# ---------------------------------------------------------------------------

@router.post("/analyze")
@limiter.limit("10/minute")
async def analyze_python_code(
    request: Request,
    body: CodeReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Analyze Python code submitted as plain text."""
    return await review_service.analyze_code(
        body.code, db=db, user_id=current_user.id, filename=getattr(body, "filename", None)
    )


@router.post("/upload")
@limiter.limit("10/minute")
async def upload_python_file(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload and analyze a .py file."""
    return await review_service.read_python_file(file, db=db, user_id=current_user.id)


# ---------------------------------------------------------------------------
# History / stats
# ---------------------------------------------------------------------------

@router.get("/history")
def get_review_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Paginated list of the current user's reviews (newest first)."""
    items, total = review_repository.get_history(
        db, user_id=current_user.id, page=page, page_size=page_size
    )
    return {
        "success": True,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": max(1, -(-total // page_size)),  # ceiling division
        "reviews": [_review_summary(r) for r in items],
    }


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Aggregate statistics for the current user."""
    stats = review_repository.get_stats(db, user_id=current_user.id)
    return {"success": True, **stats}


# ---------------------------------------------------------------------------
# Single review CRUD  (specific paths before /{review_id} to avoid conflicts)
# ---------------------------------------------------------------------------

@router.get("/{review_id}/report")
def download_report(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download a review report as JSON."""
    review = _review_or_404(db, review_id, current_user.id)
    safe_name = (review.filename or f"review_{review_id}").replace(" ", "_")
    return JSONResponse(
        content=_review_full(review),
        headers={
            "Content-Disposition": f'attachment; filename="{safe_name}_report.json"',
        },
    )


@router.get("/{review_id}")
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a single review by ID (must belong to current user)."""
    review = _review_or_404(db, review_id, current_user.id)
    return {"success": True, "review": _review_full(review)}


@router.delete("/{review_id}", status_code=status.HTTP_200_OK)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a review (must belong to current user)."""
    _review_or_404(db, review_id, current_user.id)
    review_repository.delete(db, review_id=review_id, user_id=current_user.id)
    return {"success": True, "message": f"Review {review_id} deleted."}


# ---------------------------------------------------------------------------
# Serialisation helpers
# ---------------------------------------------------------------------------

def _review_summary(r) -> dict:
    """Lightweight dict for history listing (excludes code and full analysis)."""
    return {
        "id": r.id,
        "filename": r.filename,
        "language": r.language,
        "score": r.score,
        "rating": r.rating,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    }


def _review_full(r) -> dict:
    """Full dict including analysis + ai_review (excludes raw code for response size)."""
    return {
        "id": r.id,
        "user_id": r.user_id,
        "filename": r.filename,
        "language": r.language,
        "score": r.score,
        "rating": r.rating,
        "analysis": r.analysis,
        "ai_review": r.ai_review,
        "created_at": r.created_at.isoformat() if r.created_at else None,
    }