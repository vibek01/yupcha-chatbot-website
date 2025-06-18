from typing import List
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.models import Post
from app.schemas.post import PostCreate, PostRead

async def create_post(db: AsyncSession, post_in: PostCreate) -> PostRead:
    post = Post.from_orm(post_in)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return PostRead.from_orm(post)

async def get_posts(db: AsyncSession) -> List[PostRead]:
    stmt = select(Post).order_by(Post.created_at.desc())
    result = await db.execute(stmt)
    posts = result.scalars().all()
    return [PostRead.from_orm(p) for p in posts]
