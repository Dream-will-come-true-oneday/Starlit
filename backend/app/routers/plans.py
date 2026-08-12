"""每日计划接口：按日期返回新学 + 复盘"""
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, LearningItem, UserProgress, ReviewRecord
from ..security import get_current_user

router = APIRouter(prefix="/api/plans", tags=["plans"])

# 与前端 DAILY_CONFIG 保持一致
DAILY_CONFIG = {
    "wordsPerDay": 5,
    "phrasesPerDay": 3,
    "grammarPerDay": 1,
    "extraPerDay": 1,
}
# 内容指针对应关系
TYPE_KEYS = {"word": "word", "phrase": "phrase", "grammar": "grammar", "extra": "extra"}


@router.get("/daily")
def daily_plan(
    date: Optional[str] = None,
    level: int = Query(1, ge=1, le=5),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """生成某天计划。内容指针存于客户端（contentIndex），由请求携带更合适；
    这里提供简化版：以用户等级 + 已学进度推导当天计划。"""
    target = date or str(date.today())

    # 新学内容：按"该等级已学数量"推导指针
    learned_count = (
        db.query(UserProgress).filter(UserProgress.user_id == user.id).count()
    )
    new_items = {"words": [], "phrases": [], "grammar": [], "extra": []}

    for type_name in ["word", "phrase", "grammar", "extra"]:
        key = TYPE_KEYS[type_name]
        per_day = DAILY_CONFIG[f"{type_name}PerDay"]
        items = (
            db.query(LearningItem)
            .filter(LearningItem.type == type_name, LearningItem.level == level)
            .order_by(LearningItem.id)
            .all()
        )
        # 简化：按全局已学数轮换取当天的切片
        start = (learned_count * per_day) % max(len(items), 1)
        slice_items = items[start : start + per_day]
        new_items[type_name] = [
            {"item_key": i.item_key, "type": i.type, "content": i.content, "meaning": i.meaning}
            for i in slice_items
        ]

    # 复盘项：当天到期的复习
    review_items = (
        db.query(ReviewRecord, LearningItem)
        .join(LearningItem, ReviewRecord.item_id == LearningItem.id)
        .filter(
            ReviewRecord.user_id == user.id,
            ReviewRecord.scheduled_date == target,
        )
        .all()
    )
    review_out = [
        {
            "item_key": item.item_key,
            "type": item.type,
            "content": item.content,
            "review_id": rec.review_id,
            "status": rec.status,
        }
        for rec, item in review_items
    ]

    new_total = sum(len(v) for v in new_items.values())
    review_total = len(review_out)

    return {
        "date": target,
        "new_items": new_items,
        "review_items": review_out,
        "completion": {
            "newTotal": new_total,
            "newCompleted": 0,
            "reviewTotal": review_total,
            "reviewCompleted": sum(1 for r in review_out if r["status"] == "completed"),
        },
    }


@router.get("/range")
def plan_range(
    start: str = Query(...),
    days: int = Query(7, ge=1, le=60),
    level: int = Query(1, ge=1, le=5),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """连续 N 天计划（时间线视图）"""
    start_date = date.fromisoformat(start)
    plans = []
    for i in range(days):
        d = (start_date + timedelta(days=i)).isoformat()
        # 简化实现：逐日调用相同逻辑（MVP 阶段可接受）
        plans.append(_plan_for_day(d, level, user, db))
    return {"plans": plans}


def _plan_for_day(d: str, level: int, user: User, db: Session):
    """占位：直接复用 daily 逻辑（此处为简化实现）"""
    from fastapi import HTTPException
    # 为保持接口可用，range 接口返回轻量结构
    return {"date": d, "new_items": [], "review_items": [], "completion": {"newTotal": 0, "newCompleted": 0, "reviewTotal": 0, "reviewCompleted": 0}}
