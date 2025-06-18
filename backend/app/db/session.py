# app/db/session.py

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create the async engine.
# SSL is handled in your URL (?sslmode=require&supa=...), so no need for explicit SSL args.
# We disable asyncpg's prepared-statement cache via connect_args.
async_engine = create_async_engine(
    settings.sqlalchemy_database_url,
    echo=True,
    future=True,
    connect_args={"statement_cache_size": 0},
)

# sessionmaker factory for AsyncSession
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
