# app/routers/users.py

from fastapi import APIRouter, Depends, status
from app.schemas.user import UserProfile
from app.dependencies.auth import get_current_user
from app.database.models import User
from app.core.exceptions import APIException

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Retrieves the profile of the current authenticated user.
    """
    return current_user