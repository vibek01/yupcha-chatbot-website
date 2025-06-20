# app/api/posts.py

from fastapi import APIRouter
from typing import Any
from app.schemas.post import PostCreate
from app.services.post_service import send_tweet

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.post("/", response_model=Any)
async def create_tweet(post: PostCreate):
    """
    Receive { title, content } from the frontend,
    forward `content` to the Twitter‑Clone service,
    and return whatever JSON they give us.
    """
    return await send_tweet(post.content)
