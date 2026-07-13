from fastapi import HTTPException, status

class CustomException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class UserAlreadyExistsException(CustomException):
    def __init__(self, email: str):
        super().__init__(
            status_code=status_code.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{email}' already exists."
        )

class InvalidCredentialsException(CustomException):
    def __init__(self):
        super().__init__(
            status_code=status_code.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or invalid login."
        )

class InactiveUserException(CustomException):
    def __init__(self):
        super().__init__(
            status_code=status_code.HTTP_403_FORBIDDEN,
            detail="This user account is inactive."
        )

class UserNotFoundException(CustomException):
    def __init__(self):
        super().__init__(
            status_code=status_code.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

class TokenExpiredException(CustomException):
    def __init__(self):
        super().__init__(
            status_code=status_code.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please login again."
        )

class InvalidTokenException(CustomException):
    def __init__(self):
        super().__init__(
            status_code=status_code.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )
