# app/services/generate_service.py

import asyncio
from openai import OpenAI
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.generate import GenerateRequest

# Initialize the OpenRouter client once
client = OpenAI(
    base_url=settings.openrouter_url,
    api_key=settings.openrouter_api_key,
)

async def generate_tweet_topic(req: GenerateRequest) -> str:
    # Build the original tweet prompt exactly as before
    prompt = (
        f"Write a concise, engaging tweet about the topic: \"{req.topic}\". "
        f"Target exactly {req.length} words (do not exceed {req.length + 5} words). "
        f"Use a {req.tone} tone. "
    )


    if req.hashtags_include:
        inc = " ".join(f"#{tag.strip()}" for tag in req.hashtags_include)
        prompt += f"Include only these hashtags: {inc}. "
    else:
        prompt += "Do not add any hashtags. "

    if req.url:
        prompt += f"If relevant, include this URL: {req.url}. "

    prompt += "Be sure to keep the tweet under 280 characters."

    # Helper to call the synchronous .create(...) in a thread
    async def _call_model() -> str:
        try:
            resp = await asyncio.to_thread(
                client.chat.completions.create,
                extra_headers={
                    "HTTP-Referer": "https://your-site-url.com",  # optional
                    "X-Title":      "Tweet Generator",             # optional
                },
                extra_body={},  # preserve the signature from your snippet
                model=settings.openrouter_model,
                messages=[
                    {"role": "system", "content": "You are a tweet generator."},
                    {"role": "user",   "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Tweet generation failed: {e}")

        try:
            return resp.choices[0].message.content.strip()
        except (AttributeError, IndexError, KeyError):
            raise HTTPException(status_code=500, detail="Unexpected response format")

    # First generation
    tweet = await _call_model()

    # Enforce word count: retry once if out of bounds
    words = tweet.split()
    if not (len(words) == req.length or len(words) <= req.length + 5):
        tweet = await _call_model()

    return tweet
