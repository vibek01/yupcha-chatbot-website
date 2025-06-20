# backend/app/services/chat_service.py

import re
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status

from app.schemas.chat import ChatResponse
from app.services.post_service import send_tweet  
from app.core.config import settings

# Allow dot matching so newlines count; capture title up to dash OR newline
POST_REGEX = re.compile(
    r'post this\s*:\s*(?P<title>.+?)(?:\s*-\s*|\s*\n)(?P<content>.+)', 
    re.IGNORECASE | re.DOTALL
)

async def handle_chat(db: AsyncSession, message: str) -> ChatResponse:
    """
    If user says "post this: Title - Content"  OR
    "post this: Title\\nContent",
    forward Title + Content to Twitter‑Clone.
    Otherwise, proxy to OpenRouter.
    """
    m = POST_REGEX.match(message)
    if m:
        title = m.group("title").strip()
        content = m.group("content").strip()

        # Combine title + content into the single 'content' payload
        to_send = f"**{title}**\n\n{content}"

        try:
            resp = await send_tweet(to_send)
        except HTTPException as exc:
            # Return a chat reply that includes the error details
            raise HTTPException(
                status_code=exc.status_code,
                detail=f"Failed to post tweet: {exc.detail}"
            )

        return ChatResponse(
            reply=f"✅ Tweet posted!\n\nExternal API response:\n{resp}"
        )

    # ── Fallback to OpenRouter AI ────────────────────────────────────────
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
