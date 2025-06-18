# app/api/chat.py

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.deps import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import handle_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    return await handle_chat(db, req.message)

