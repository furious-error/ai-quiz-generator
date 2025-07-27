# app/dependencies/database.py

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
from app.database.connection import client as mongo_client # Import the client directly

async def get_database_client() -> AsyncIOMotorClient:
    """
    Dependency to provide the MongoDB client instance.
    Ensures the client is initialized before proceeding.
    """
    if mongo_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service is not available."
        )
    return mongo_client

# You might use this if you need direct motor client access in a router,
# e.g., @app.get("/some_data") async def get_data(db_client: AsyncIOMotorClient = Depends(get_database_client)):
#     # ... use db_client ...
#
# However, for most Beanie operations (like User.find_one()), this isn't strictly necessary
# as Beanie manages the connection implicitly after initialization.