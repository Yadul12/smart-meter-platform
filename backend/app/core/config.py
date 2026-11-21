import os
import shutil
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
BUNDLED_DB = BACKEND_DIR / "smart_meter.db"

def _resolve_db_urls():
    env_async = os.getenv("DATABASE_URL")
    env_sync = os.getenv("DATABASE_URL_SYNC")
    if env_async and env_sync:
        return env_async, env_sync

    # On Vercel or read-only serverless filesystems, copy bundled SQLite DB to /tmp
    if os.getenv("VERCEL") or not os.access(str(BACKEND_DIR), os.W_OK):
        tmp_db = Path("/tmp/smart_meter.db")
        if not tmp_db.exists() and BUNDLED_DB.exists():
            shutil.copy2(str(BUNDLED_DB), str(tmp_db))
        return f"sqlite+aiosqlite:///{tmp_db}", f"sqlite:///{tmp_db}"

    return f"sqlite+aiosqlite:///{BUNDLED_DB}", f"sqlite:///{BUNDLED_DB}"

_ASYNC_URL, _SYNC_URL = _resolve_db_urls()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Metering Management Platform (IS 16444)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "smart-meter-platform-secret-key-is16444-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = _ASYNC_URL
    DATABASE_URL_SYNC: str = _SYNC_URL
    CORS_ORIGINS: List[str] = ["*"]
    SIMULATION_ENABLED: bool = True
    SIMULATION_TICK_SECONDS: int = 15

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
