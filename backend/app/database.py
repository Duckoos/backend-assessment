from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.task import Task

async def init_db():
    client = AsyncIOMotorClient(settings.mongo_uri)
    await init_beanie(database=client.get_database("backend_assessment"), document_models=[User, Task])
