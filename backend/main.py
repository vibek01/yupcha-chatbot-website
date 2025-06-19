import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db
from app.api import posts, chat

app = FastAPI(title="Chat & Posts API")


# ─── CORS ──────────────────────────────────────────────────────────
# Allow your Solid.js frontend (running on localhost:3000) to talk to this API
origins = [
    "https://yupcha-chatbot-website.pages.dev/"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # frontends allowed
    allow_origin_regex=r"https://.*\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],         # Content-Type, Authorization, etc.
)
# ──────────────────────────────────────────────────────────────────

# Include routers exactly once. 
# Each router already defines its own prefix of "/api/posts" or "/api/chat".
app.include_router(posts.router)
app.include_router(chat.router)

# Create tables on startup
@app.on_event("startup")
async def on_startup():
    await init_db()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
