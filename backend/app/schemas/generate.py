# app/schemas/generate.py

from pydantic import BaseModel, Field
from typing import List, Optional

class GenerateRequest(BaseModel):
    topic: str
    length: int = Field(
        140,
        title="Desired tweet length",
        ge=10,
        le=280,
        description="Rough target character count for the tweet"
    )
    tone: str = Field(
        "general",
        title="Tone of voice",
        description="One of: professional, general, casual, humorous, inspirational"
    )
    hashtags_include: List[str] = Field(
        default_factory=list,
        title="Include Hashtags",
        description="List of hashtags to include"
    )
    hashtags_exclude: List[str] = Field(
        default_factory=list,
        title="Exclude Hashtags",
        description="List of hashtags to avoid"
    )
    url: Optional[str] = Field(
        None,
        title="Optional URL",
        description="A URL to include if relevant"
    )

class GenerateResponse(BaseModel):
    generated: str
