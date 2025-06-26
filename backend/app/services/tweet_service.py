# File: app/services/tweet_service.py
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime
from fastapi import HTTPException, status

from app.db.models import Tweet

async def create_tweet(db: AsyncSession, topic: str, content: str):
    tweet = Tweet(topic=topic, content=content, posted=False)
    db.add(tweet)
    await db.commit()
    await db.refresh(tweet)
    return tweet

async def list_tweets(db: AsyncSession, posted: bool):
    stmt = select(Tweet).where(Tweet.posted == posted).order_by(Tweet.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

async def mark_posted(db: AsyncSession, tweet_id: int):
    tweet = await db.get(Tweet, tweet_id)
    if not tweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tweet not found")
    tweet.posted     = True
    tweet.updated_at = datetime.utcnow()
    db.add(tweet)
    await db.commit()
    await db.refresh(tweet)
    return tweet

async def update_tweet(db: AsyncSession, tweet_id: int, content: str):
    tweet = await db.get(Tweet, tweet_id)
    if not tweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tweet not found")
    tweet.content    = content
    tweet.updated_at = datetime.utcnow()
    db.add(tweet)
    await db.commit()
    await db.refresh(tweet)
    return tweet

