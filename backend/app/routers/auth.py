# app/routers/auth.py

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from app.schemas.auth import UserCreate, UserLogin, Token
from app.schemas.user import UserProfile
from app.services import auth_service
from app.core.exceptions import APIException

router = APIRouter()

@router.post("/register", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Registers a new user.
    """
    try:
        new_user = await auth_service.register_user(user_data)
        return new_user
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to register user: {e}"
        )

@router.post("/login", response_model=Token)
async def login_for_access_token(user_data: UserLogin):
    """
    Authenticates a user and returns an access token.
    """
    try:
        token = await auth_service.authenticate_user(user_data.email, user_data.password)
        return token
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to login: {e}"
        )