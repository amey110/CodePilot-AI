from typing import Generic, TypeVar, Type, Optional, List, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import Base
from app.models.user import User

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in_data: dict) -> ModelType:
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: ModelType, obj_in_data: dict) -> ModelType:
        for field, value in obj_in_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: Any) -> Optional[ModelType]:
        obj = db.query(self.model).filter(self.model.id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(self.model).filter(self.model.email == email).first()

# Global repository instance to be injected
user_repository = UserRepository()


# ---------------------------------------------------------------------------
# Review repository (imported lazily to avoid circular imports at module load)
# ---------------------------------------------------------------------------
class ReviewRepository:
    def __init__(self):
        # Import here to avoid circular import at module-level
        from app.models.review import Review
        self.model = Review

    def get(self, db: Session, *, review_id: int, user_id: int):
        """Fetch a single review owned by user_id, or None."""
        return (
            db.query(self.model)
            .filter(self.model.id == review_id, self.model.user_id == user_id)
            .first()
        )

    def get_history(
        self, db: Session, *, user_id: int, page: int = 1, page_size: int = 10
    ) -> Tuple[List, int]:
        """Return (items, total_count) for the given user, paginated."""
        base_q = db.query(self.model).filter(self.model.user_id == user_id)
        total = base_q.count()
        items = (
            base_q.order_by(self.model.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return items, total

    def create(self, db: Session, *, obj_in_data: dict):
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, review_id: int, user_id: int):
        obj = self.get(db, review_id=review_id, user_id=user_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def get_stats(self, db: Session, *, user_id: int) -> dict:
        from app.models.review import Review
        row = (
            db.query(
                func.count(Review.id).label("total_reviews"),
                func.avg(Review.score).label("average_score"),
            )
            .filter(Review.user_id == user_id)
            .one()
        )
        # Count total issues across all reviews
        reviews = db.query(Review.analysis).filter(Review.user_id == user_id).all()
        total_issues = 0
        for (analysis,) in reviews:
            if analysis and isinstance(analysis, dict):
                total_issues += analysis.get("summary", {}).get("total_issues", 0)
        return {
            "total_reviews": row.total_reviews or 0,
            "average_score": round(row.average_score or 0, 2),
            "total_issues": total_issues,
        }


review_repository = ReviewRepository()
