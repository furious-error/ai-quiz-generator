# app/core/exceptions.py

from fastapi import status

class APIException(Exception):
    """
    Custom exception for API errors to provide standardized responses.
    """
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        message: str = "An unexpected error occurred."
    ):
        self.status_code = status_code
        self.message = message
        super().__init__(self.message)