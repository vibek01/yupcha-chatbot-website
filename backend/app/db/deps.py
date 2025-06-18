# app/db/deps.py

from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import AsyncSessionLocal

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

