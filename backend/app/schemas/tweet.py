# app/schemas/tweet.py
from datetime import datetime
# FIX: Import ConfigDict to handle model configuration in Pydantic V2.
from pydantic import BaseModel, ConfigDict

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

    # FIX: Replaced the old `class Config` with the new `model_config`.
    # 'from_attributes=True' is the new name for 'orm_mode = True'.
    model_config = ConfigDict(from_attributes=True)