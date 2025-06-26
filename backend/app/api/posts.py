from typing import Any
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.schemas.post import PostCreate
from app.services.post_service import send_tweet
from app.services.tweet_service import create_tweet, mark_posted
from app.db.deps import get_db

router = APIRouter(tags=["posts"])

@router.post("", response_model=Any)
async def create_and_post(post: PostCreate, db: AsyncSession = Depends(get_db)):
    resp = await send_tweet(post.content)
    tweet = await create_tweet(db, post.title, post.content)
    await mark_posted(db, tweet.id)
    return resp
