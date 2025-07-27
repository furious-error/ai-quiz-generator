# app/dependencies/auth.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.database.models import User
from app.core.exceptions import APIException
from datetime import date

# OAuth2PasswordBearer will look for a token in the 'Authorization: Bearer <token>' header
# The `tokenUrl` is where clients should go to get a token (your login endpoint).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Dependency to get the current authenticated user from the JWT token.
    """
    if not token:
        raise APIException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Not authenticated. No token provided."
        )

    try:
        payload = decode_access_token(token) # This will raise APIException if token is invalid
        user_email: str = payload.get("sub") # 'sub' typically holds the subject of the token (e.g., user email)

        if user_email is None:
            raise APIException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Could not validate credentials. Token payload missing user."
            )

        # Fetch the user from the database
        user = await User.find_one(User.email == user_email)

        if user is None:
            raise APIException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="User not found."
            )

        # Ensure daily rate limit counter is reset if it's a new day
        current_date = date.today()
        if user.last_request_date != current_date:
            user.daily_ai_requests_count = 0
            user.last_request_date = current_date
            await user.save() # Persist the changes

        return user

    except APIException as e:
        # Re-raise the custom APIException from decode_access_token
        raise e
    except Exception as e:
        # Catch any other unexpected errors during user retrieval
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"An unexpected error occurred during authentication: {e}"
        )