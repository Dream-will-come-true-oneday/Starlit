"""应用配置：环境变量集中管理"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # JWT
    SECRET_KEY: str = "change-me-in-production"   # 生产环境必须通过环境变量覆盖
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24     # 24 小时

    # 数据库（本地开发默认 SQLite，生产用 PostgreSQL）
    DATABASE_URL: str = "sqlite:///./starlit.db"

    # CORS：前端地址
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    # DeepSeek LLM（每日对话练习：场景生成 / 对话 / 报告）
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-v4-flash"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
