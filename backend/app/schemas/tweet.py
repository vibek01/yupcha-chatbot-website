# app/schemas/tweet.py
from datetime import datetime
from pydantic import BaseModel

class TweetBase(BaseModel):
    topic: str
    content: str

class TweetCreate(TweetBase):
    pass

class TweetRead(TweetBase):
    id: int
    posted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
