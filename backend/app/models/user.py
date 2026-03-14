from datetime import datetime
from pydantic import Field, EmailStr
from beanie import Document

class User(Document):
    name: str = Field(..., max_length=100)
    email: EmailStr = Field(...)
    hashed_password: str = Field(...)
    role: str = Field("user", pattern="^(user|admin)$")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "users"
        validate_on_save = True
        indexes = [
            "email"
        ]
