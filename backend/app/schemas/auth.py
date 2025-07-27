# app/schemas/auth.py

from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    """
    Schema for user registration input.
    """
    email: EmailStr
    password: str = Field(min_length=8, max_length=50, description="Password must be between 8 and 50 characters.")

class UserLogin(BaseModel):
    """
    Schema for user login input.
    """
    email: EmailStr
    password: str

class Token(BaseModel):
    """
    Schema for the JWT token response.
    """
    access_token: str
    token_type: str = "bearer"