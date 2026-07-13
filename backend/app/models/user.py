import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    # We use Integer primary keys for simplicity or UUID strings.
    # An auto-incrementing Integer is standard, but UUID is great for SaaS.
    # Let's use Integer for simple relations, or UUID for security. Let's use Integer primary keys.
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    profile_image = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )
