# app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
# from pydantic import Field # Import Field for default_factory
from typing import List, Union

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or a .env file.
    """
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Project metadata
    PROJECT_NAME: str = "AI Quiz Generator API"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "API for generating and managing AI-powered quizzes."

    # Database settings
    MONGO_URI: str
    DATABASE_NAME: str

    # JWT settings for authentication
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int # Token expiration time in minutes

    # Google Gemini API settings
    GEMINI_API_KEY: str

    # CORS settings
    ALLOWED_ORIGINS: List[str] = ["https://furious-error.github.io/ai-quiz-generator/"] # Default for development

    # Rate limiting settings
    DAILY_AI_REQUEST_LIMIT: int

    # PDF Upload Settings
    MAX_PDF_SIZE_MB: int = 5 # Maximum allowed PDF file size in MB
    MAX_PDF_SIZE_BYTES: int = (MAX_PDF_SIZE_MB * 1024 * 1024) # Convert MB to Bytes
    ALLOWED_PDF_MIME_TYPE: str = "application/pdf"

settings = Settings()
