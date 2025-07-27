# app/services/rate_limit_service.py

from datetime import date
from app.database.models import User
from app.core.config import settings
from app.core.exceptions import APIException
from fastapi import status

async def check_and_increment_ai_usage(user: User):
    """
    Checks the user's daily AI request limit and increments the counter.
    Resets the counter if it's a new day.
    """
    current_date = date.today()

    if user.last_request_date != current_date:
        user.daily_ai_requests_count = 0
        user.last_request_date = current_date
        await user.save()

    if user.daily_ai_requests_count + 1 > settings.DAILY_AI_REQUEST_LIMIT:
        raise APIException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            message=f"Daily AI quiz generation limit ({settings.DAILY_AI_REQUEST_LIMIT}) exceeded. Please try again tomorrow."
        )

    user.daily_ai_requests_count += 1
    await user.save()