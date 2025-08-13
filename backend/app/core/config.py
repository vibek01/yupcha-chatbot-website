# app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # These are the lowercase variables your application code uses.
    database_url:          str
    twitterclone_base_url: str
    twitterclone_api_key:  str
    openrouter_api_key:    str
    openrouter_base_url:   str
    openrouter_model:      str

    # This configuration is the bridge between your code and the environment.
    # It tells Pydantic: "When you look for a variable for the 'database_url'
    # field, you can match an environment variable named 'DATABASE_URL'."
    model_config = SettingsConfigDict(
        env_file='.env',         # For local development
        case_sensitive=False,    # This is the crucial setting that makes it work
        env_file_encoding='utf-8'
    )

    # This property uses the lowercase attribute, which is consistent.
    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        if "?" in url:
            url = url.split("?", 1)[0]
        return url

settings = Settings()