"""Pydantic 请求/响应模型"""
from datetime import date, datetime
from typing import List, Optional, Any, Dict

from pydantic import BaseModel, EmailStr, Field


# ---------- 认证 ----------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    nickname: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    email: str
    nickname: str
    level: int
    streak_days: int
    last_checkin_date: Optional[date] = None

    class Config:
        from_attributes = True


# ---------- 内容 ----------
class ItemOut(BaseModel):
    id: int
    item_key: str
    type: str
    level: int
    category: str
    content: str
    meaning: str
    phonetic: str
    example: str
    example_cn: str
    structure: str
    rule: str
    detail: str
    tips: List[str] = []
    recommend: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


# ---------- 进度同步 ----------
class ReviewSync(BaseModel):
    review_id: int
    scheduled_date: date
    status: str = "pending"
    completed_date: Optional[date] = None
    updated_at: Optional[str] = None


class ProgressSyncItem(BaseModel):
    item_key: str          # 前端 itemId，如 word-l1-001
    type: str              # word | phrase | grammar | extra
    learned_date: date
    memory_strength: int = 0
    is_mastered: bool = False
    reviews: List[ReviewSync] = []


class ProgressSyncRequest(BaseModel):
    """增量同步：客户端本地变更批量提交"""
    items: List[ProgressSyncItem]
    # 删除标记：复习状态回退（客户端以"已打卡"优先，一般不会删除）
    removed_item_keys: List[str] = []


class ProgressSyncResponse(BaseModel):
    synced: int
    conflicts: List[Dict[str, Any]] = []
    server_time: datetime


# ---------- 打卡 ----------
class CheckInRequest(BaseModel):
    item_key: str
    review_id: int


class CheckInResponse(BaseModel):
    item_key: str
    review_id: int
    status: str
    memory_strength: int
    is_mastered: bool


# ---------- 每日计划 ----------
class PlanItem(BaseModel):
    item_key: str
    type: str
    content: str
    meaning: str


class DailyPlanOut(BaseModel):
    date: str
    new_items: Dict[str, Any]      # words/phrases/grammar/extra/sentence
    review_items: List[Dict[str, Any]]
    completion: Dict[str, int]


# 提前解析 UserOut 引用
TokenResponse.model_rebuild()
