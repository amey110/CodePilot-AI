from sqlalchemy.orm import Session
from app.database.repository import user_repository
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from app.exceptions.custom_exceptions import UserAlreadyExistsException, InvalidCredentialsException

class AuthService:
    def register_user(self, db: Session, user_in: UserCreate) -> User:
        # Check if user already exists
        existing_user = user_repository.get_by_email(db, email=user_in.email)
        if existing_user:
            raise UserAlreadyExistsException(email=user_in.email)
        
        # Prepare user data (remove confirm_password before inserting into model)
        user_data = {
            "email": user_in.email,
            "full_name": user_in.full_name,
            "hashed_password": get_password_hash(user_in.password),
            "profile_image": user_in.profile_image,
            "is_active": True
        }
        
        # Create user
        return user_repository.create(db, obj_in_data=user_data)

    def authenticate_user(self, db: Session, user_login: UserLogin) -> User:
        # Fetch user
        user = user_repository.get_by_email(db, email=user_login.email)
        if not user:
            raise InvalidCredentialsException()
        
        # Verify password
        if not verify_password(user_login.password, user.hashed_password):
            raise InvalidCredentialsException()
            
        return user

auth_service = AuthService()
