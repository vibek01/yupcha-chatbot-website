# File: main.py
import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config  import settings
from app.db.session   import init_db
from app.api.generate import router as generate_router
from app.api.posts    import router as posts_router
from app.api.tweets   import router as tweets_router

# Configure a simple logger that prints to stdout
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Tweet Generator API")
app.router.redirect_slashes = False

# === CORS MIDDLEWARE ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yupcha-chatbot-website.pages.dev/"],            
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === ROUTERS ===
app.include_router(generate_router, prefix="/api/generate")
app.include_router(posts_router,    prefix="/api/posts")
app.include_router(tweets_router,   prefix="/api/tweets")

@app.on_event("startup")
async def on_startup():
    await init_db()
    logger.info("Database initialized")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
