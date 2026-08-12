"""进度接口：Local-first 同步核心
- POST /api/progress/sync     增量同步（客户端批量提交本地变更）
- GET  /api/progress/snapshot 全量拉取（首次登录 / 换设备）
"""
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, LearningItem, UserProgress, ReviewRecord
from ..schemas import ProgressSyncRequest, ProgressSyncResponse
from ..security import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])


def _item_map(db: Session) -> dict:
    """item_key -> LearningItem 映射（内存缓存单请求内）"""
    return {i.item_key: i for i in db.query(LearningItem).all()}


def _item_key_by_id(db: Session) -> dict:
    """item_id -> item_key 映射（snapshot 反查用）"""
    return {i.id: i.item_key for i in db.query(LearningItem).all()}


@router.post("/sync", response_model=ProgressSyncResponse)
def sync_progress(
    req: ProgressSyncRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """增量同步：以客户端提交为准（Last-Write-Wins），打卡状态"已打卡"优先"""
    item_map = _item_map(db)
    synced = 0
    conflicts = []

    # 客户端已有进度的映射：item_id -> UserProgress
    existing = {
        p.item_id: p
        for p in db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
    }

    for sync_item in req.items:
        item = item_map.get(sync_item.item_key)
        if not item:
            conflicts.append({"item_key": sync_item.item_key, "reason": "内容不存在"})
            continue

        progress = existing.get(item.id)
        if not progress:
            progress = UserProgress(
                user_id=user.id,
                item_id=item.id,
                type=sync_item.type,
                learned_date=sync_item.learned_date,
                memory_strength=sync_item.memory_strength,
                is_mastered=sync_item.is_mastered,
            )
            db.add(progress)
            db.flush()
            existing[item.id] = progress

        # 复习记录：已打卡优先（不可逆）
        review_map = {
            r.review_id: r
            for r in db.query(ReviewRecord).filter(
                ReviewRecord.progress_id == progress.id
            ).all()
        }
        for r in sync_item.reviews:
            record = review_map.get(r.review_id)
            if record is None:
                record = ReviewRecord(
                    user_id=user.id,
                    item_id=item.id,
                    progress_id=progress.id,
                    review_id=r.review_id,
                    scheduled_date=r.scheduled_date,
                    status=r.status,
                    completed_date=r.completed_date,
                )
                db.add(record)
            else:
                # 冲突规则：云端已完成则保持完成，否则用客户端状态
                if record.status != "completed" and r.status == "completed":
                    record.status = "completed"
                    record.completed_date = r.completed_date or datetime.utcnow().date()
                elif record.status != "completed":
                    record.status = r.status
                    record.completed_date = r.completed_date

        # 汇总记忆强度
        all_records = db.query(ReviewRecord).filter(ReviewRecord.progress_id == progress.id).all()
        completed = sum(1 for rec in all_records if rec.status == "completed")
        progress.memory_strength = round(completed / 6 * 100) if all_records else sync_item.memory_strength
        progress.is_mastered = bool(all_records) and completed == 6
        synced += 1

    db.commit()
    return ProgressSyncResponse(synced=synced, conflicts=conflicts, server_time=datetime.utcnow())


@router.get("/snapshot")
def get_snapshot(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """全量拉取：返回用户全部学习进度 + 复习记录"""
    key_by_id = _item_key_by_id(db)
    result = []
    for p in db.query(UserProgress).filter(UserProgress.user_id == user.id).all():
        reviews = [
            {
                "review_id": r.review_id,
                "scheduled_date": str(r.scheduled_date),
                "status": r.status,
                "completed_date": str(r.completed_date) if r.completed_date else None,
            }
            for r in sorted(p.reviews, key=lambda x: x.review_id)
        ]
        result.append({
            "item_key": key_by_id.get(p.item_id, str(p.item_id)),
            "type": p.type,
            "learned_date": str(p.learned_date),
            "memory_strength": p.memory_strength,
            "is_mastered": p.is_mastered,
            "reviews": reviews,
        })
    return {"items": result, "server_time": str(datetime.utcnow())}
