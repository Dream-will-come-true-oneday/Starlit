"""复习打卡接口"""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, LearningItem, UserProgress, ReviewRecord
from ..schemas import CheckInRequest, CheckInResponse
from ..security import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/checkin", response_model=CheckInResponse)
def checkin(
    req: CheckInRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(LearningItem).filter(LearningItem.item_key == req.item_key).first()
    if not item:
        raise HTTPException(status_code=404, detail="内容不存在")

    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.item_id == item.id)
        .first()
    )
    if not progress:
        raise HTTPException(status_code=404, detail="尚未学习该内容")

    review = (
        db.query(ReviewRecord)
        .filter(ReviewRecord.progress_id == progress.id, ReviewRecord.review_id == req.review_id)
        .first()
    )
    if not review:
        raise HTTPException(status_code=404, detail="复习节点不存在")

    if review.status == "pending":
        review.status = "completed"
        review.completed_date = datetime.utcnow().date()
        review.updated_at = datetime.utcnow()

    # 重算记忆强度与掌握状态
    all_records = db.query(ReviewRecord).filter(ReviewRecord.progress_id == progress.id).all()
    completed = sum(1 for r in all_records if r.status == "completed")
    progress.memory_strength = round(completed / 6 * 100) if all_records else 0
    progress.is_mastered = bool(all_records) and completed == 6
    progress.updated_at = datetime.utcnow()

    # 维护连续打卡
    _update_streak(user, db)

    db.commit()
    return CheckInResponse(
        item_key=req.item_key,
        review_id=req.review_id,
        status=review.status,
        memory_strength=progress.memory_strength,
        is_mastered=progress.is_mastered,
    )


def _update_streak(user: User, db: Session):
    """连续打卡：今天有打卡动作则计数"""
    from datetime import date, timedelta

    today = date.today()
    if user.last_checkin_date == today:
        return
    yesterday = today - timedelta(days=1)
    user.streak_days = user.streak_days + 1 if user.last_checkin_date == yesterday else 1
    user.last_checkin_date = today
