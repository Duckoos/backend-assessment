from datetime import datetime
from pydantic import Field
from beanie import Document, Link
from app.models.user import User

class Task(Document):
    title: str = Field(..., max_length=255)
    description: str = Field(None)
    status: str = Field("pending", pattern="^(pending|in-progress|completed)$")
    priority: str = Field("medium", pattern="^(low|medium|high)$")
    owner: Link[User]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tasks"
        validate_on_save = True
