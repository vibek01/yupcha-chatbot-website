from sqlmodel import SQLModel, Field
from datetime import datetime

class Tweet(SQLModel, table=True):
    id:       int | None = Field(default=None, primary_key=True)
    topic:    str
    content:  str
    posted:   bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
