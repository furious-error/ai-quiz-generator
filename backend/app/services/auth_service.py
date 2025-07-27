# app/services/auth_service.py

from app.database.models import User
from app.schemas.auth import UserCreate, Token
from app.schemas.user import UserProfile
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.exceptions import APIException
from fastapi import status

async def register_user(user_data: UserCreate) -> UserProfile:
    """
    Registers a new user in the database.
    Hashes the password before saving.
    """
    print(user_data)
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise APIException(
            status_code=status.HTTP_409_CONFLICT,
            message="User with this email already exists."
        )

    hashed_password = get_password_hash(user_data.password)

    new_user = User(
        email=user_data.email,
        password_hash=hashed_password
    )

    await new_user.insert()

    return UserProfile(
        id=str(new_user.id),
        email=new_user.email,
        created_at=new_user.created_at,
        daily_ai_requests_count=new_user.daily_ai_requests_count,
        last_request_date=new_user.last_request_date
    )

async def authenticate_user(email: str, password: str) -> Token:
    """
    Authenticates a user and generates an access token.
    """
    user = await User.find_one(User.email == email)
    if not user:
        raise APIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Incorrect email or password."
        )

    if not verify_password(password, user.password_hash):
        raise APIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Incorrect email or password."
        )

    access_token = create_access_token(data={"sub": user.email})

    return Token(access_token=access_token, token_type="bearer")