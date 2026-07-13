from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, model_validator

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=50, description="User's full name")
    profile_image: Optional[str] = Field(None, description="URL of user's profile image")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    confirm_password: str = Field(..., description="Confirmation password")

    @model_validator(mode="after")
    def passwords_match(self) -> 'UserCreate':
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    profile_image: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
