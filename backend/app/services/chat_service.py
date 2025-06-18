import re
import httpx
from sqlmodel.ext.asyncio.session import AsyncSession


from app.schemas.chat import ChatResponse
from app.services.post_service import create_post
from app.schemas.post import PostCreate
from app.core.config import settings


async def handle_chat(db: AsyncSession, message: str) -> ChatResponse:
    # If user uses the "post this: Title - Content" pattern, create a Post in the DB
    m = re.match(r'post this\s*:\s*(.+?)\s*-\s*(.+)', message, re.IGNORECASE)
    if m:
        title, content = m.groups()
        post = await create_post(db, PostCreate(title=title, content=content))
        return ChatResponse(reply=f"✅ Post created with ID {post.id}")


    # Otherwise, proxy the message to OpenRouter
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