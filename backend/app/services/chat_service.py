# backend/app/services/chat_service.py

import re
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import HTTPException, status

from app.schemas.chat import ChatResponse
from app.services.post_service import send_tweet  
from app.core.config import settings

# Match "post this: Title - Content"
FULL_REGEX = re.compile(
    r'post this\s*:\s*(?P<title>.+?)(?:\s*-\s*|\s*\n)(?P<content>.+)', 
    re.IGNORECASE | re.DOTALL
)

# Match "post this: Title" with no dash/content
TITLE_ONLY_REGEX = re.compile(
    r'post this\s*:\s*(?P<title>.+)', 
    re.IGNORECASE
)

async def handle_chat(db: AsyncSession, message: str) -> ChatResponse:
    # 1) FULL match: user provided both title and content
    m_full = FULL_REGEX.match(message)
    if m_full:
        title = m_full.group("title").strip()
        content = m_full.group("content").strip()
        to_send = f"{title}: {content}"

        try:
            resp = await send_tweet(to_send)
        except HTTPException as exc:
            raise HTTPException(exc.status_code, f"Failed to post tweet: {exc.detail}")

        return ChatResponse(reply=f"✅ Tweet posted!\n\n{resp}")

    # 2) TITLE‑ONLY: generate body via your AI model
    m_title = TITLE_ONLY_REGEX.match(message)
    if m_title:
        title = m_title.group("title").strip()

        # Ask OpenRouter to draft a social‑media post for this title
        prompt = (
            f"Write a concise, engaging social‑media post expanding on the topic: “{title}”. "
            "Keep it to one or two short paragraphs."
        )
        payload = {
            "model": settings.openrouter_model,
            "messages": [
                {"role": "system", "content": "You are a social‑media copywriter."},
                {"role": "user", "content": prompt}
            ]
        }
        headers = {
            "Authorization": f"Bearer {settings.openrouter_api_key}",
            "Content-Type": "application/json"
        }

        # 2a) get generated content
        async with httpx.AsyncClient() as client:
            ai_resp = await client.post(
                settings.openrouter_url,
                headers=headers,
                json=payload,
                timeout=15.0
            )
            ai_resp.raise_for_status()
            ai_data = ai_resp.json()
            body = ai_data["choices"][0]["message"]["content"].strip()

        # 2b) combine and send
        to_send = f"{title}: {body}"
        try:
            ext = await send_tweet(to_send)
        except HTTPException as exc:
            raise HTTPException(exc.status_code, f"Failed to post generated tweet: {exc.detail}")

        return ChatResponse(
            reply=(
                f"✅ Generated and posted tweet!\n\n"
                f"Title: {title}\n"
                f"Body: {body}\n\n"
                f"External API said: {ext}"
            )
        )

    # 3) fallback: normal chat via OpenRouter
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
