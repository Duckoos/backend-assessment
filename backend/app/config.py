from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017/backend_assessment"
    jwt_secret: str = "your_super_secret_jwt_key_here"  # Should be overridden in production
    jwt_expire_minutes: int = 1440 # 24 hours
    port: int = 8000
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
