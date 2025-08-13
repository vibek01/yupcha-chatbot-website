# app/schemas/post.py

from datetime import datetime
# FIX: Import ConfigDict to handle model configuration in Pydantic V2.
from pydantic import BaseModel, ConfigDict

class PostCreate(BaseModel):
    title: str
    content: str

class PostRead(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    # FIX: Replaced the old `class Config` with the new `model_config`.
    # 'from_attributes=True' is the new name for 'orm_mode = True'.
    model_config = ConfigDict(from_attributes=True)