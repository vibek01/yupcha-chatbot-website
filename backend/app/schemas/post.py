# app/schemas/post.py

from datetime import datetime
from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str

class PostRead(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    

    class Config:
        orm_mode = True
