# app/services/post_service.py

import httpx
from fastapi import HTTPException
from app.core.config import settings

async def send_tweet(content: str) -> dict:
    """
    Forwards `content` to the external Twitter‑Clone API.
    """
    url = f"{settings.twitterclone_base_url}/post_tweet"
    headers = {"api-key": settings.twitterclone_api_key}
    payload = {"content": content}

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers=headers, timeout=10.0)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Twitter‑Clone API error: {resp.text}"
        )
    return resp.json()
