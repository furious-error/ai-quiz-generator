# app/schemas/user.py (Updated)

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime, date
from beanie.odm.fields import PydanticObjectId 

class UserProfile(BaseModel):
    """
    Schema for displaying user profile information.
    """
    id: PydanticObjectId = Field(alias="_id")
    email: EmailStr
    created_at: datetime
    daily_ai_requests_count: int
    last_request_date: date

    model_config = ConfigDict(
        populate_by_name=True, 
        json_encoders={
            datetime: lambda dt: dt.isoformat(),
            date: lambda d: d.isoformat(),
        },
        arbitrary_types_allowed=True,
    )