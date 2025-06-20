# backend/app/services/chat_service.py

import re
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException

from app.schemas.chat import ChatResponse
from app.services.post_service import send_tweet  
from app.core.config import settings

POST_REGEX = re.compile(
    r'post this\s*:\s*(?P<title>.+?)(?:\s*-\s*|\s*\n)(?P<content>.+)', 
    re.IGNORECASE | re.DOTALL
)

async def handle_chat(db: AsyncSession, message: str) -> ChatResponse:
    m = POST_REGEX.match(message)
    if m:
        title = m.group("title").strip()
        content = m.group("content").strip()

        # ─── NEW ───────────────────────────────────────────────────────
        # Combine title and body in plain text:
        to_send = f"{title}\n\n{content}"
        # ───────────────────────────────────────────────────────────────

        try:
            resp = await send_tweet(to_send)
        except HTTPException as exc:
            raise HTTPException(
                status_code=exc.status_code,
                detail=f"Failed to post tweet: {exc.detail}"
            )

        return ChatResponse(
            reply=f"✅ Tweet posted!\n\nExternal API response:\n{resp}"
        )

    # Fallback to OpenRouter…
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
