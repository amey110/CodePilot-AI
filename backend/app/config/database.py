import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Code Reviewer"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/code_reviewer"
    
    # JWT Auth Settings
    SECRET_KEY: str = "3dbefc9769da8d15a5bbd6f90ff8efce1b7470fcfd58434cd6d72986cd0575d1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
