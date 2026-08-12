"""内容接口：四模块内容查询（只读）"""
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import LearningItem
from ..schemas import ItemOut

router = APIRouter(prefix="/api/items", tags=["items"])

# 内容为公共数据，可不登录访问（配合 CDN 缓存）
VALID_TYPES = {"word", "phrase", "grammar", "extra"}


@router.get("", response_model=list[ItemOut])
def list_items(
    type: str = Query(..., description="word | phrase | grammar | extra"),
    level: Optional[int] = Query(None, ge=1, le=5),
    category: Optional[str] = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    if type not in VALID_TYPES:
        return []

    q = db.query(LearningItem).filter(LearningItem.type == type)
    if level:
        q = q.filter(LearningItem.level == level)
    if category:
        q = q.filter(LearningItem.category == category)

    items = q.order_by(LearningItem.id).offset(offset).limit(limit).all()
    return items


@router.get("/{item_key}", response_model=ItemOut)
def get_item(item_key: str, db: Session = Depends(get_db)):
    item = db.query(LearningItem).filter(LearningItem.item_key == item_key).first()
    return item if item else None
