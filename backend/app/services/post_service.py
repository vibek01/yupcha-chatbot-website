# backend/app/services/post_service.py

import httpx
from fastapi import HTTPException
from app.core.config import settings

async def send_tweet(content: str) -> dict:
    """
    Forwards `content` to the external Twitter‑Clone API.
    Payload must match:
      { "username": "...", "text": "..." }
    """
    # extract username from your API key (before the underscore)
    username = settings.twitterclone_api_key.split("_", 1)[0]

    url = f"{settings.twitterclone_base_url}/post_tweet"
    headers = {"api-key": settings.twitterclone_api_key}
    payload = {
        "username": username,
        "text": content
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers=headers, timeout=10.0)

    if resp.status_code != 200:
        # print to your server log for debugging
        print("Twitter‑Clone error:", resp.status_code, resp.text)
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Twitter‑Clone API error: {resp.text}"
        )
    return resp.json()
