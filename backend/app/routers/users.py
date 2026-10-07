"""
Users router — profile and password management.

Endpoints
---------
PUT  /api/users/profile          Update full_name
POST /api/users/change-password  Change password (requires old password)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.database.repository import user_repository
from app.models.user import User
from app.core.security import verify_password, get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])


# ---------------------------------------------------------------------------
# Request schemas (inline — simple enough not to need a separate file)
# ---------------------------------------------------------------------------

class UpdateProfileRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.put("/profile", status_code=status.HTTP_200_OK)
def update_profile(
    body: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the authenticated user's full name."""
    updated = user_repository.update(
        db,
        db_obj=current_user,
        obj_in_data={"full_name": body.full_name.strip()},
    )
    return {
        "success": True,
        "message": "Profile updated successfully.",
        "user": {
            "id": updated.id,
            "full_name": updated.full_name,
            "email": updated.email,
        },
    }


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    body: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the authenticated user's password."""
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )

    if body.current_password == body.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must differ from the current password.",
        )

    user_repository.update(
        db,
        db_obj=current_user,
        obj_in_data={"hashed_password": get_password_hash(body.new_password)},
    )
    return {"success": True, "message": "Password changed successfully."}
