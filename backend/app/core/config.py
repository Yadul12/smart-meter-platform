import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Metering Management Platform (IS 16444)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "smart-meter-platform-secret-key-is16444-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./smart_meter.db")
    DATABASE_URL_SYNC: str = os.getenv("DATABASE_URL_SYNC", "sqlite:///./smart_meter.db")
    CORS_ORIGINS: List[str] = ["*"]
    SIMULATION_ENABLED: bool = True
    SIMULATION_TICK_SECONDS: int = 15

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
