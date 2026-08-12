"""数据模型：对应架构文档附录 E 的数据库设计"""
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Date, DateTime, Boolean, Float, Text, JSON, UniqueConstraint, ForeignKey
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    nickname = Column(String(50), default="")
    level = Column(Integer, default=1)          # 当前解锁等级 1-5
    streak_days = Column(Integer, default=0)    # 连续打卡天数
    last_checkin_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")


class LearningItem(Base):
    __tablename__ = "learning_items"
    __table_args__ = (UniqueConstraint("type", "item_key", name="uq_item_type_key"),)

    id = Column(Integer, primary_key=True)
    type = Column(String(16), nullable=False)        # word | phrase | grammar | extra
    item_key = Column(String(40), nullable=False)    # 原前端 id，如 word-l1-001
    level = Column(Integer, nullable=False)          # 1-5
    category = Column(String(40), default="")
    content = Column(String(200), nullable=False)    # 英文内容
    meaning = Column(String(200), default="")        # 中文释义
    phonetic = Column(String(60), default="")
    example = Column(Text, default="")
    example_cn = Column(Text, default="")
    structure = Column(String(200), default="")
    rule = Column(Text, default="")
    detail = Column(Text, default="")
    tips = Column(JSON, default=list)
    recommend = Column(JSON, nullable=True)
    version = Column(Integer, default=1)             # 内容版本，支持无发版更新
    created_at = Column(DateTime, default=datetime.utcnow)


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (UniqueConstraint("user_id", "item_id", name="uq_user_item"),)

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("learning_items.id"), nullable=False)
    type = Column(String(16), nullable=False)        # 冗余便于查询
    learned_date = Column(Date, nullable=False)      # 首次学习日期
    memory_strength = Column(Integer, default=0)     # 记忆强度 0-100
    is_mastered = Column(Boolean, default=False)     # 6 轮复习全部完成
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")
    reviews = relationship("ReviewRecord", back_populates="progress", cascade="all, delete-orphan")


class ReviewRecord(Base):
    __tablename__ = "review_records"
    __table_args__ = (UniqueConstraint("user_id", "item_id", "review_id", name="uq_user_item_review"),)

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("learning_items.id"), nullable=False)
    progress_id = Column(Integer, ForeignKey("user_progress.id"), nullable=False)
    review_id = Column(Integer, nullable=False)      # 0-5 对应 6 个节点
    scheduled_date = Column(Date, nullable=False)    # 计划复习日期
    status = Column(String(16), default="pending")   # pending | completed | missed
    completed_date = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="reviews")
