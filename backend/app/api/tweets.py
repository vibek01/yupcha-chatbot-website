# File: app/api/tweets.py
from typing import List
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.schemas.tweet import TweetCreate, TweetRead
from app.services.tweet_service import (
    create_tweet,
    list_tweets,
    update_tweet,
    mark_posted,
)
from app.db.deps import get_db

router = APIRouter(tags=["tweets"])

@router.post("", response_model=TweetRead)
async def save_draft(post: TweetCreate, db: AsyncSession = Depends(get_db)):
    return await create_tweet(db, post.topic, post.content)

@router.get("", response_model=List[TweetRead])
async def get_tweets(posted: bool = False, db: AsyncSession = Depends(get_db)):
    return await list_tweets(db, posted)

@router.patch("/{tweet_id}", response_model=TweetRead)
async def edit_draft(tweet_id: int, post: TweetCreate, db: AsyncSession = Depends(get_db)):
    return await update_tweet(db, tweet_id, post.content)
