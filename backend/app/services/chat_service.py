import re
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException

from app.schemas.chat import ChatResponse
# ── REPLACE create_post import with send_tweet
from app.services.post_service import send_tweet  
from app.core.config import settings

async def handle_chat(db: AsyncSession, message: str) -> ChatResponse:
    """
    If the user says “post this: Title - Content”, forward `Content` to Twitter‑Clone.
    Otherwise proxy to OpenRouter.
    """
    m = re.match(r'post this\s*:\s*(.+?)\s*-\s*(.+)', message, re.IGNORECASE)
    if m:
        title, content = m.groups()
        # 1) Send to external Twitter‑Clone API
        try:
            resp = await send_tweet(content)
        except HTTPException as e:
            # bubble up any external‑API errors
            raise

        # 2) Confirm to the user
        return ChatResponse(
            reply=f"✅ Tweet posted! External service replied: {resp}"
        )

    # ── Otherwise, fall back to OpenRouter AI ──────────────────────────────
    payload = {
        "model": settings.openrouter_model,
        "messages": [
            {"role": "user", "content": message}
        ]
    }
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            settings.openrouter_url,
            headers=headers,
            json=payload,
            timeout=10.0
        )
        resp.raise_for_status()
        data = resp.json()
        reply = data["choices"][0]["message"]["content"]

    return ChatResponse(reply=reply)