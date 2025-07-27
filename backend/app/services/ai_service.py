# app/services/ai_service.py

import google.generativeai as genai
import json
from app.core.config import settings
from app.core.exceptions import APIException
from fastapi import status
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash')

async def generate_quiz_content(topic: str, num_questions: int, difficulty: str) -> Dict[str, Any]:
    """
    Generates quiz questions and explanations using the Google Gemini API based on a given topic.

    Args:
        topic (str): The topic for the quiz.
        num_questions (int): The desired number of questions.
        difficulty (str): The difficulty level (easy, medium, hard).

    Returns:
        Dict[str, Any]: A dictionary containing quiz data parsed from the AI response.

    Raises:
        APIException: If the AI generation fails or returns an invalid format.
    """
    prompt = f"""
    Generate a multiple-choice quiz about the topic "{topic}".
    The quiz should have {num_questions} questions.
    The difficulty level should be {difficulty}.

    For each question, provide:
    1. The question text.
    2. Exactly 4 options (A, B, C, D).
    3. The correct answer (must be one of the options).
    4. A detailed explanation for why the correct answer is correct and why the other options are incorrect.

    Ensure the output is a JSON object in the following exact format:
    {{
        "topic": "{topic}",
        "difficulty": "{difficulty}",
        "num_questions": {num_questions},
        "questions": [
            {{
                "question_text": "...",
                "options": ["...", "...", "...", "..."],
                "correct_answer": "...",
                "explanation": "..."
            }},
            // ... more question objects ...
        ]
    }}
    Make sure the JSON is valid and complete. Do not include any text before or after the JSON.
    """
    # logger.info(f"DEBUG: Sending topic-based prompt to Gemini for topic='{topic}'...")
    return await _call_gemini_for_quiz(prompt, topic, num_questions, difficulty)


async def generate_quiz_from_text(text_content: str, num_questions: int, difficulty: str) -> Dict[str, Any]:
    """
    Generates quiz questions and explanations from provided text content using the Google Gemini API.

    Args:
        text_content (str): The text content from which to generate the quiz.
        num_questions (int): The desired number of questions.
        difficulty (str): The difficulty level (easy, medium, hard).

    Returns:
        Dict[str, Any]: A dictionary containing quiz data parsed from the AI response.

    Raises:
        APIException: If the AI generation fails or returns an invalid format.
    """

    prompt = f"""
    Generate a multiple-choice quiz based ONLY on the following text content.
    The quiz should have {num_questions} questions.
    The difficulty level should be {difficulty}.

    For each question, provide:
    1. The question text.
    2. Exactly 4 options (A, B, C, D).
    3. The correct answer (must be one of the options).
    4. A detailed explanation for why the correct answer is correct and why the other options are incorrect, drawing specifically from the provided text.

    Text Content:
    ---
    {text_content}
    ---

    Ensure the output is a JSON object in the following exact format:
    {{
        "topic": "Generated topic from text",
        "difficulty": "{difficulty}",
        "num_questions": {num_questions},
        "questions": [
            {{
                "question_text": "...",
                "options": ["...", "...", "...", "..."],
                "correct_answer": "...",
                "explanation": "..."
            }},
            // ... more question objects ...
        ]
    }}
    Make sure the JSON is valid and complete. Do not include any text before or after the JSON.
    Keep the 'topic' field concise, summarizing the content.
    """
    # logger.info(f"DEBUG: Sending text-based prompt to Gemini for {num_questions} questions at {difficulty} difficulty from {len(text_content)} chars of text.")
    return await _call_gemini_for_quiz(prompt, "Text-based Quiz", num_questions, difficulty)


async def _call_gemini_for_quiz(prompt: str, original_topic: str, expected_num_questions: int, expected_difficulty: str) -> Dict[str, Any]:
    """
    Internal helper function to call Gemini API and validate its quiz response.
    """
    try:
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.7,
            )
        )
        # logger.info(f"DEBUG: Raw Gemini response text received. Length: {len(response.text)}")

        quiz_data = json.loads(response.text)
        # logger.info(f"DEBUG: Parsed quiz_data (partial): {list(quiz_data.keys())}...")

        if not isinstance(quiz_data, dict) or "questions" not in quiz_data:
            raise ValueError("AI response is not in the expected JSON format or missing 'questions'.")
        if not isinstance(quiz_data["questions"], list):
            raise ValueError("'questions' field is not a list.")
        if len(quiz_data["questions"]) != expected_num_questions:
            # logger.warning(f"AI returned {len(quiz_data['questions'])} questions, expected {expected_num_questions}. Using what was returned.")
            raise ValueError("Returned Length does not match expected number of questions")

        for q in quiz_data["questions"]:
            if not all(k in q for k in ["question_text", "options", "correct_answer", "explanation"]):
                raise ValueError("One or more questions are missing required fields (question_text, options, correct_answer, explanation).")
            if not isinstance(q["options"], list) or len(q["options"]) != 4:
                raise ValueError("Question options are not in the correct format or count (expected 4).")
            if q["correct_answer"] not in q["options"]:
                # logger.warning(f"AI correct answer '{q['correct_answer']}' not found in options for question: '{q['question_text'][:50]}'")
                raise ValueError(f"AI correct answer '{q['correct_answer']}' is not one of the provided options for question: '{q['question_text'][:50]}...'")

        if "topic" not in quiz_data or not quiz_data["topic"]:
            quiz_data["topic"] = original_topic
            # logger.warning(f"AI response missing 'topic' field. Falling back to '{original_topic}'.")
        if "difficulty" not in quiz_data or quiz_data["difficulty"].lower() not in ["easy", "medium", "hard"]:
            quiz_data["difficulty"] = expected_difficulty
            # logger.warning(f"AI response missing or invalid 'difficulty' field. Falling back to '{expected_difficulty}'.")
            
        quiz_data["num_questions"] = len(quiz_data["questions"])


        return quiz_data

    except json.JSONDecodeError as e:
        # logger.error(f"JSONDecodeError in AI response: {e}. Raw response text: {response.text if 'response' in locals() else 'N/A'}", exc_info=True)
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"AI returned invalid JSON: {e}. Please try again or refine your request."
        )
    except ValueError as e:
        # logger.error(f"AI response validation failed: {e}", exc_info=True)
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"AI response format invalid: {e}. Please try a different topic/file or parameters."
        )
    except Exception as e:
        # logger.error(f"General error communicating with AI service: {e}", exc_info=True)
        raise APIException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Error communicating with AI service: {e}. Check API key and network."
        )