# main.py

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

from app.core.config import settings
from app.database.connection import initiate_database
from app.routers import auth, quizzes, users
from app.core.exceptions import APIException


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the application.
    Connects to the database on startup and disconnects on shutdown.
    """
    print("Application startup: Connecting to database...")
    await initiate_database()
    print("Database connection established.")
    yield 
    print("Application shutdown: Closing database connection...")
    print("Database connection closed (or pool released).")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.PROJECT_DESCRIPTION,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # List of allowed origins
    allow_credentials=True,                  # Allow cookies and Authorization headers
    allow_methods=["*"],                     # Allow all standard HTTP methods
    allow_headers=["*"],                     # Allow all headers
)


@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    """
    Handles custom APIException instances, returning a standardized JSON response.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(quizzes.router, prefix="/api/v1/quizzes", tags=["Quizzes"])


@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Quiz Generator API! Visit /docs for API documentation."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)