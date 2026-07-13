from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import UserCreate, UserOut, UserLogin, Token
from app.services.auth_service import auth_service
from app.core.security import create_access_token
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user into the application.
    """
    return auth_service.register_user(db, user_in)

@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user and returns a JWT access token.
    """
    user = auth_service.authenticate_user(db, user_login)
    access_token = create_access_token(subject=user.email, user_id=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Retrieves information about the currently authenticated user.
    """
    return current_user

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: User = Depends(get_current_user)):
    """
    Invalidates client session. Since JWT is stateless, the server responds
    with confirmation and the client removes the stored token.
    """
    return {"message": "Successfully logged out. Please clear your authentication headers."}
