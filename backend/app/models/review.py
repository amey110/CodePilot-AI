from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Submission metadata
    filename = Column(String, nullable=True)          # None for paste-in code
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False, default="Python")

    # Scoring
    score = Column(Float, nullable=True)
    rating = Column(String, nullable=True)

    # Full analysis payload (all analyzer results + issues)
    analysis = Column(JSON, nullable=True)

    # Gemini AI review payload (nullable — may fail gracefully)
    ai_review = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationship (optional, for ORM navigation)
    owner = relationship("User", back_populates="reviews")
