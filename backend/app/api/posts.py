# File: backend/app/api/posts.py
import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.schemas.post import PostCreate
from app.services.post_service import send_tweet
from app.services.tweet_service import create_tweet, mark_posted
from app.db.deps import get_db

router = APIRouter(tags=["posts"])
logger = logging.getLogger(__name__)

@router.post("", response_model=Any)
async def create_and_post(
    post: PostCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1) send to Twitter/OpenRouter/etc
        resp = await send_tweet(post.content)

        # 2) save draft record
        tweet = await create_tweet(db, post.title, post.content)

        # 3) flip posted flag on the original tweet record
        await mark_posted(db, tweet.id)

        return resp

    except Exception as e:
        # Log the full traceback so you can inspect Render logs
        logger.exception("Error in create_and_post:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while posting the tweet: {e}"
        )