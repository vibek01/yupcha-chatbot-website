# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db
from app.api.generate import router as generate_router
from app.api.posts    import router as posts_router
from app.api.tweets   import router as tweets_router

app = FastAPI(title="Tweet Generator API")
app.router.redirect_slashes = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yupcha-chatbot-website.pages.dev/"],
    allow_origin_regex=r"https://.*\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.include_router(generate_router, prefix="/api/generate")
app.include_router(posts_router,    prefix="/api/posts")
app.include_router(tweets_router,   prefix="/api/tweets")

@app.on_event("startup")
async def on_startup():
    await init_db()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
