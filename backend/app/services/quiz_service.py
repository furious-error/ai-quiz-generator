# app/services/quiz_service.py

from app.database.models import User, Quiz, Question, QuizAttempt
from app.schemas.quiz import QuizOutput, QuestionSchema, QuizResultOutput, SubmittedAnswer
from app.core.exceptions import APIException
from fastapi import status
from typing import List, Dict, Any
from beanie import PydanticObjectId
import logging


logger = logging.getLogger(__name__)


async def save_quiz(user_id: str, quiz_data: Dict[str, Any]) -> Quiz:
    """
    Saves a newly generated quiz and its questions to the database.
    """
    logger.info("DEBUG: Starting save_quiz function.")
    question_models_for_quiz = []
    for q_data in quiz_data["questions"]:
        try:
            question = Question(
                question_text=q_data["question_text"],
                options=q_data["options"],
                correct_answer=q_data["correct_answer"],
                explanation=q_data["explanation"]
            )
            # logger.info(f"DEBUG: Question BaseModel created with ID: {question.id} for text: '{q_data['question_text'][:50]}...'")

        except Exception as e:
            # logger.error(f"ERROR: Failed to create Question BaseModel instance: {e}", exc_info=True)
            raise APIException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message=f"Error creating question data: {e}"
            )
        question_models_for_quiz.append(question)

    # logger.info("DEBUG: All questions prepared as BaseModels. Attempting to create Quiz document.")
    try:
        quiz = Quiz(
            user_id=user_id,
            topic=quiz_data["topic"],
            difficulty=quiz_data["difficulty"],
            num_questions=quiz_data["num_questions"],
            questions=question_models_for_quiz
        )
        # logger.info(f"DEBUG: Attempting to insert quiz for topic: '{quiz_data['topic']}'")

        await quiz.insert() 
        # logger.info(f"DEBUG: Successfully inserted quiz with ID: {quiz.id}")
    except Exception as e:
        # logger.error(f"ERROR: Failed to insert quiz into MongoDB: {e}", exc_info=True)
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Database error during quiz save: {e}"
        )

    # logger.info("DEBUG: Quiz and questions saved. Returning Beanie Quiz Document.")
    return quiz 

async def submit_quiz_attempt(user_id: str, quiz_id: str, submitted_answers: List[SubmittedAnswer]) -> QuizResultOutput:
    # logger.info(f"DEBUG: submit_quiz_attempt called for quiz_id: {quiz_id} by user_id: {user_id}")
    try:
        quiz_obj_id = PydanticObjectId(quiz_id)
    except Exception as e:
        # logger.error(f"ERROR: Invalid quiz_id format: {quiz_id}. Error: {e}", exc_info=True)
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Invalid Quiz ID format."
        )

    quiz = await Quiz.get(quiz_obj_id)
    # logger.info(f"DEBUG: Quiz lookup result: {'Found' if quiz else 'Not Found'} for ID: {quiz_id}")

    if not quiz:
        # logger.warning(f"WARNING: Quiz not found for ID: {quiz_id}")
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Quiz not found."
        )

    if str(quiz.user_id) != user_id:
        logger.warning(f"WARNING: User {user_id} tried to submit quiz {quiz_id} not belonging to them. Quiz user_id: {quiz.user_id}")
        raise APIException(
            status_code=status.HTTP_403_FORBIDDEN,
            message="You do not have permission to submit answers for this quiz."
        )

    # logger.info(f"DEBUG: Quiz {quiz_id} found and belongs to user {user_id}. Proceeding with evaluation.")

    total_questions = len(quiz.questions)
    correct_count = 0
    results_detail = []

    question_map = {q.id: q for q in quiz.questions}

    for submitted_ans in submitted_answers:
        question_id_str = submitted_ans.question_id
        selected_option = submitted_ans.selected_option

        question_doc = question_map.get(question_id_str)

        if not question_doc:
            # logger.warning(f"WARNING: Submitted answer for unknown question ID: {question_id_str} in quiz {quiz_id}")
            continue

        is_correct = (selected_option == question_doc.correct_answer)
        if is_correct:
            correct_count += 1

        results_detail.append({
            "question_id": question_id_str,
            "question_text": question_doc.question_text,
            "options": question_doc.options,
            "selected_option": selected_option,
            "correct_answer": question_doc.correct_answer,
            "is_correct": is_correct,
            "explanation": question_doc.explanation
        })

    score = correct_count * 10

    quiz_attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz_id,
        score=score,
        submitted_answers=[ans.model_dump() for ans in submitted_answers]
    )
    try:
        await quiz_attempt.insert()
        # logger.info(f"DEBUG: Quiz attempt {quiz_attempt.id} saved for user {user_id} on quiz {quiz_id}.")
    except Exception as e:
        # logger.error(f"ERROR: Failed to save quiz attempt: {e}", exc_info=True)
        raise APIException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, message=f"Database error saving attempt: {e}")


    # logger.info(f"DEBUG: Returning QuizResultOutput for quiz {quiz_id}.")
    return QuizResultOutput(
        quiz_id=quiz_id,
        total_questions=total_questions,
        correct_count=correct_count,
        score=score,
        results=results_detail,
        submitted_at=quiz_attempt.submitted_at
    )


async def get_quiz_by_id(quiz_id: str, user_id: str) -> Quiz:
    quiz = await Quiz.get(PydanticObjectId(quiz_id))
    if not quiz:
        raise APIException(status.HTTP_404_NOT_FOUND, "Quiz not found.")
    if quiz.user_id != user_id:
        raise APIException(status.HTTP_403_FORBIDDEN, "You do not have permission to view this quiz.")

    return quiz

async def get_user_quizzes(user_id: str) -> List[Quiz]:
    quizzes = await Quiz.find(Quiz.user_id == user_id).to_list()
    return quizzes