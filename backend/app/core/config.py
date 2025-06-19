# app/core/config.py

from pydantic import BaseSettings, Field
import re

class Settings(BaseSettings):
    database_url:      str = Field(..., env="DATABASE_URL")
    openrouter_api_key: str = Field(..., env="OPENROUTER_API_KEY")
    openrouter_model:   str = Field(..., env="OPENROUTER_MODEL")
    openrouter_url:     str = Field(..., env="OPENROUTER_URL")

    class Config:
        env_file = ".env"
        case_sensitive = True


    @property
    def sqlalchemy_database_url(self) -> str:
        """
        Return a SQLAlchemy‑compatible URL:
        - converts "postgres://" → "postgresql+asyncpg://"
        - strips any query params like ?sslmode=require
        """
        url = self.database_url
        if url.startswith("postgres://"):
            url = re.sub(r"^postgres://", "postgresql+asyncpg://", url)
        if "?" in url:
            url = url.split("?", 1)[0]
        return url

# instantiate once
settings = Settings()