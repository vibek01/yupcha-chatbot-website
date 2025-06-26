# app/api/generate.py

from fastapi import APIRouter
from app.schemas.generate import GenerateRequest, GenerateResponse
from app.services.generate_service import generate_tweet_topic

router = APIRouter(tags=["generate"])

@router.post("", response_model=GenerateResponse)
async def generate_endpoint(req: GenerateRequest):
    generated = await generate_tweet_topic(req)
    return GenerateResponse(generated=generated)
