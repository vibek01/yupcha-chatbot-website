# app/core/config.py

# Import SettingsConfigDict, which is the new way to configure settings models.
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import re

class Settings(BaseSettings):
    # These fields still define the required environment variables.
    database_url:          str
    twitterclone_base_url: str
    twitterclone_api_key:  str
    openrouter_api_key:    str
    openrouter_url:        str
    openrouter_model:      str

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = re.sub(r"^postgres://", "postgresql+asyncpg://", url)
        if "?" in url:
            url = url.split("?", 1)[0]
        return url

# clear instructions on how to find and load your secrets.
settings = Settings()