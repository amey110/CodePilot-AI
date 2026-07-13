from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.repository import user_repository
from app.core.security import decode_access_token
from app.models.user import User
from app.exceptions.custom_exceptions import (
    InvalidTokenException, 
    UserNotFoundException, 
    InactiveUserException
)

# In oauth2 password flow, tokenUrl points to our login endpoint
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False  # Allow us to handle authentication errors with custom exceptions
)

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    if not token:
        raise InvalidTokenException()
        
    payload = decode_access_token(token)
    if not payload:
        raise InvalidTokenException()
        
    email: str = payload.get("sub")
    user_id: int = payload.get("user_id")
    if email is None or user_id is None:
        raise InvalidTokenException()
        
    user = user_repository.get(db, id=user_id)
    if not user:
        raise UserNotFoundException()
        
    if not user.is_active:
        raise InactiveUserException()
        
    return user
