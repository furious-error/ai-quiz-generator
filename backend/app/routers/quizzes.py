# app/routers/quizzes.py

from fastapi import APIRouter, Depends, status, Path, UploadFile, File, Form
from typing import List, Optional
from app.schemas.quiz import QuizGenerateInput, QuizOutput, QuizSubmissionInput, QuizResultOutput, QuestionSchema
from app.dependencies.auth import get_current_user
from app.database.models import User, Quiz
from app.services import ai_service, quiz_service, rate_limit_service, pdf_service
from app.core.exceptions import APIException
from beanie.odm.fields import PydanticObjectId
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate", response_model=QuizOutput, status_code=status.HTTP_201_CREATED)
async def generate_quiz_endpoint(
    quiz_input: QuizGenerateInput,
    current_user: User = Depends(get_current_user)
):
    """
    Generates a new quiz based on user input using AI.
    Applies daily AI usage rate limit.
    """
    try:
        await rate_limit_service.check_and_increment_ai_usage(current_user)

        generated_quiz_data = await ai_service.generate_quiz_content(
            topic=quiz_input.topic,
            num_questions=quiz_input.num_questions,
            difficulty=quiz_input.difficulty
        )

        saved_quiz_document = await quiz_service.save_quiz(str(current_user.id), generated_quiz_data)

        return QuizOutput(
            id=str(saved_quiz_document.id),
            user_id=str(saved_quiz_document.user_id),
            topic=saved_quiz_document.topic,
            difficulty=saved_quiz_document.difficulty,
            num_questions=saved_quiz_document.num_questions,
            questions=[
                QuestionSchema(
                    id=q.id,
                    question_text=q.question_text,
                    options=q.options,
                    correct_answer=q.correct_answer,
                    explanation=q.explanation
                ) for q in saved_quiz_document.questions
            ],
            generated_at=saved_quiz_document.generated_at
        )

    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to generate quiz: {e}"
        )


@router.post("/generate-from-file", response_model=QuizOutput, status_code=status.HTTP_201_CREATED)
async def generate_quiz_from_file_endpoint(
    file: UploadFile = File(..., description="PDF file to extract quiz content from."),
    num_questions: int = Form(..., gt=5, le=20, description="Number of questions (5-20)."),
    difficulty: str = Form(..., pattern="^(easy|medium|hard)$", description="Difficulty level (easy, medium, hard)."),
    current_user: User = Depends(get_current_user)
):
    """
    Generates a new quiz by extracting text from an uploaded PDF file and using AI.
    Applies daily AI usage rate limit.
    """
    try:

        await rate_limit_service.check_and_increment_ai_usage(current_user)
        text_content = await pdf_service.extract_text_from_pdf(file)
        # logger.info(f"Successfully extracted {len(text_content)} characters from PDF: {file.filename}")

        generated_quiz_data = await ai_service.generate_quiz_from_text(
            text_content=text_content,
            num_questions=num_questions,
            difficulty=difficulty
        )

        saved_quiz_document = await quiz_service.save_quiz(str(current_user.id), generated_quiz_data)
        # logger.info(f"Quiz from file '{file.filename}' saved with ID: {saved_quiz_document.id}")

        return QuizOutput(
            id=str(saved_quiz_document.id),
            user_id=str(saved_quiz_document.user_id),
            topic=saved_quiz_document.topic,
            difficulty=saved_quiz_document.difficulty,
            num_questions=saved_quiz_document.num_questions,
            questions=[
                QuestionSchema(
                    id=q.id,
                    question_text=q.question_text,
                    options=q.options,
                    correct_answer=q.correct_answer,
                    explanation=q.explanation
                ) for q in saved_quiz_document.questions
            ],
            generated_at=saved_quiz_document.generated_at
        )

    except APIException as e:
        # logger.error(f"APIException in generate_quiz_from_file_endpoint: {e.message}", exc_info=True)
        raise e
    except Exception as e:
        # logger.exception("Unexpected error in generate_quiz_from_file_endpoint:")
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to generate quiz from file: {e}"
        )

@router.post("/{quiz_id}/submit", response_model=QuizResultOutput)
async def submit_quiz_answers(
    submission_input: QuizSubmissionInput,
    quiz_id: str = Path(..., description="The ID of the quiz to submit answers for."),
    current_user: User = Depends(get_current_user)
):
    """
    Submits user answers for a quiz, calculates score, and provides explanations.
    """
    try:
        quiz_result = await quiz_service.submit_quiz_attempt(
            user_id=str(current_user.id),
            quiz_id=quiz_id,
            submitted_answers=submission_input.answers
        )
        return quiz_result
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to submit quiz due to an unexpected server error: {e}"
        )

@router.get("/", response_model=List[QuizOutput])
async def get_user_quizzes_endpoint(current_user: User = Depends(get_current_user)):
    """
    Retrieves all quizzes generated by the current authenticated user.
    """
    try:
        user_quiz_documents = await quiz_service.get_user_quizzes(str(current_user.id))

        return [
            QuizOutput(
                id=str(q_doc.id),
                user_id=str(q_doc.user_id),
                topic=q_doc.topic,
                difficulty=q_doc.difficulty,
                num_questions=q_doc.num_questions,
                questions=[
                    QuestionSchema(
                        id=q.id,
                        question_text=q.question_text,
                        options=q.options,
                        correct_answer=q.correct_answer,
                        explanation=q.explanation
                    ) for q in q_doc.questions
                ],
                generated_at=q_doc.generated_at
            ) for q_doc in user_quiz_documents
        ]
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to retrieve user quizzes: {e}"
        )

@router.get("/{quiz_id}", response_model=QuizOutput)
async def get_quiz_by_id_endpoint(
    quiz_id: str = Path(..., description="The ID of the quiz to retrieve."),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves a specific quiz by its ID, ensuring it belongs to the current user.
    """
    try:
        quiz_document = await quiz_service.get_quiz_by_id(quiz_id, str(current_user.id))
        return QuizOutput(
            id=str(quiz_document.id), 
            user_id=str(quiz_document.user_id),
            topic=quiz_document.topic,
            difficulty=quiz_document.difficulty,
            num_questions=quiz_document.num_questions,
            questions=[
                QuestionSchema(
                    id=q.id,
                    question_text=q.question_text,
                    options=q.options,
                    correct_answer=q.correct_answer,
                    explanation=q.explanation
                ) for q in quiz_document.questions
            ],
            generated_at=quiz_document.generated_at
        )
    except APIException as e:
        raise e
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Failed to retrieve quiz: {e}"
        )