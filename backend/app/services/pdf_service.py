# app/services/pdf_service.py

import fitz # PyMuPDF
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from app.core.exceptions import APIException
import logging

logger = logging.getLogger(__name__)

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Validates a PDF file and extracts all readable text content from it.

    Args:
        file (UploadFile): The uploaded PDF file from FastAPI.

    Returns:
        str: The extracted text content from the PDF.

    Raises:
        APIException: If the file is invalid, too large, or text extraction fails.
    """
    if file.content_type != settings.ALLOWED_PDF_MIME_TYPE:
        # logger.warning(f"Invalid file type uploaded: {file.content_type}. Expected {settings.ALLOWED_PDF_MIME_TYPE}")
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=f"Invalid file type. Only {settings.ALLOWED_PDF_MIME_TYPE} files are allowed."
        )

    file_content = await file.read()
    file_size = len(file_content)

    if file_size > settings.MAX_PDF_SIZE_BYTES:
        logger.warning(f"Uploaded file size {file_size} bytes exceeds limit of {settings.MAX_PDF_SIZE_BYTES} bytes.")
        raise APIException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            message=f"File size exceeds the maximum allowed limit of {settings.MAX_PDF_SIZE_MB}MB."
        )

    extracted_text = ""
    try:
        doc = fitz.open(stream=file_content, filetype="pdf")
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            extracted_text += page.get_text()
        doc.close()
        
        if not extracted_text.strip():
            # logger.warning(f"PDF file '{file.filename}' contained no readable text.")
            raise APIException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Could not extract any readable text from the PDF. Please ensure it's not an image-only PDF."
            )
        
        # logger.info(f"Successfully extracted text from PDF: '{file.filename}'. Extracted {len(extracted_text)} characters.")
        return extracted_text
    except Exception as e:
        # logger.error(f"Error extracting text from PDF '{file.filename}': {e}", exc_info=True)
        raise APIException(
            message=f"Failed to process the PDF file. Please ensure it's a valid, non-corrupt PDF. Error: {e}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )