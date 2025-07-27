# app/database/models.py

from beanie import Document, Indexed
from pydantic import ConfigDict, Field, EmailStr, BaseModel
from datetime import datetime, date
from typing import List, Optional
import uuid


class Question(BaseModel):
    """
    Represents a single quiz question with its options and explanation.
    When embedded within Quiz.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_text: str
    options: List[str]
    correct_answer: str 
    explanation: str   


class QuizAttempt(Document):
    """
    Represents a user's attempt at a specific quiz.
    """
    user_id: Indexed(str) # type: ignore
    quiz_id: Indexed(str) # type: ignore
    score: int = Field(default=0)
    submitted_answers: List[dict] = Field(default_factory=list) # e.g., [{"question_id": "...", "selected_option": "..."}]
    submitted_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "quiz_attempts"
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            date: lambda d: d.isoformat(),
        }



class User(Document):
    """
    Represents a user in the system.
    """
    email: EmailStr = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.now)
    daily_ai_requests_count: int = Field(default=0)
    last_request_date: date = Field(default_factory=date.today)

    class Settings:
        name = "users"
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            date: lambda d: d.isoformat(),
        }

class Quiz(Document):
    """
    Represents an AI-generated quiz.
    """
    user_id: Indexed(str) # type: ignore
    topic: str
    difficulty: str
    num_questions: int
    questions: List[Question]
    generated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "quizzes"
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
            date: lambda d: d.isoformat(),
        }