# app/core/config.py

from pydantic import BaseSettings, Field
import re

class Settings(BaseSettings):
    database_url:          str = Field(..., env="DATABASE_URL")
    twitterclone_base_url: str = Field(..., env="TWITTERCLONE_BASE_URL")
    twitterclone_api_key:  str = Field(..., env="TWITTERCLONE_API_KEY")

    openrouter_api_key:    str = Field(..., env="OPENROUTER_API_KEY")
    openrouter_url:        str = Field(..., env="OPENROUTER_BASE_URL")
    openrouter_model:      str = Field(..., env="OPENROUTER_MODEL")

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = re.sub(r"^postgres://", "postgresql+asyncpg://", url)
        if "?" in url:
            url = url.split("?", 1)[0]
        return url

settings = Settings()
