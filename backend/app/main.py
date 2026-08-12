"""FastAPI 应用入口"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import auth, items, progress, reviews, plans, practice

# 创建数据表（生产建议用 Alembic 迁移，MVP 直接建表）
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Starlit API",
    version="1.0.0",
    description="英语学习应用后端：认证 / 内容 / 进度同步 / 打卡 / 每日计划",
)

# CORS：允许前端域名
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(progress.router)
app.include_router(reviews.router)
app.include_router(plans.router)
app.include_router(practice.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Starlit API"}
