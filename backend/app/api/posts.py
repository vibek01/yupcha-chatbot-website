# app/api/posts.py

from fastapi import APIRouter, Depends
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.deps import get_db
from app.services.post_service import get_posts
from app.schemas.post import PostRead

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.get("/", response_model=List[PostRead])
async def read_posts(db: AsyncSession = Depends(get_db)):
    return await get_posts(db)
