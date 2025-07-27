# app/schemas/quiz.py

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
from beanie.odm.fields import PydanticObjectId 


class QuizGenerateInput(BaseModel):
    """
    Schema for the input when a user wants to generate a quiz.
    """
    topic: str = Field(min_length=3, max_length=200, description="The topic for the quiz.")
    num_questions: int = Field(gt=5, le=20, description="Number of questions (5-20).")
    difficulty: str = Field(pattern="^(easy|medium|hard)$", description="Difficulty level (easy, medium, hard).")


class QuestionSchema(BaseModel):
    """
    Schema for a single question within a quiz output.
    Note: This is a BaseModel. Its 'id' field is a direct string UUID.
    """
    id: str
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: str

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }

class QuizOutput(BaseModel):
    """
    Schema for the full generated quiz output.
    """
    id: str = Field(alias="_id")
    user_id: str
    topic: str
    difficulty: str
    num_questions: int
    questions: List[QuestionSchema]
    generated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={
            datetime: lambda dt: dt.isoformat(),
            PydanticObjectId: str
        },
        arbitrary_types_allowed=True
    )



class SubmittedAnswer(BaseModel):
    """
    Schema for a single submitted answer by the user.
    """
    question_id: str
    selected_option: str

class QuizSubmissionInput(BaseModel):
    """
    Schema for the input when a user submits quiz answers.
    """
    answers: List[SubmittedAnswer]



class QuestionResult(BaseModel):
    """
    Schema for the result of a single question after submission.
    """
    question_id: str
    question_text: str
    options: List[str]
    selected_option: Optional[str]
    correct_answer: str
    is_correct: bool
    explanation: str

class QuizResultOutput(BaseModel):
    """
    Schema for the overall quiz result output.
    """
    quiz_id: str
    total_questions: int
    correct_count: int
    score: int
    results: List[QuestionResult]
    submitted_at: datetime

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }