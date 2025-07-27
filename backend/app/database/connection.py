# app/database/connection.py (CORRECTED)

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.database.models import User, Quiz, QuizAttempt

client: AsyncIOMotorClient = None

async def initiate_database():
    """
    Initializes the MongoDB connection and Beanie ODM.
    """
    global client
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)

        await init_beanie(
            database=client[settings.DATABASE_NAME],
            document_models=[
                User,
                Quiz,
                QuizAttempt,
            ]
        )
        print(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise (e)