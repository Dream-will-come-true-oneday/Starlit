#!/usr/bin/env python3
"""
内容迁移脚本：把 content-export.json 导入数据库（learning_items 表）
用法：
  cd backend
  python migrate_content.py                     # 使用默认 data/content-export.json
  python migrate_content.py data/my.json        # 指定文件
  python migrate_content.py --reset             # 先清空 learning_items 再导入

设计：幂等导入——按 item_key 存在则更新（version+1），不存在则插入。
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.database import SessionLocal, Base, engine
from app.models import LearningItem


def main():
    parser = argparse.ArgumentParser(description="导入英语学习内容到数据库")
    parser.add_argument("file", nargs="?", default="data/content-export.json",
                        help="内容 JSON 文件路径（默认 data/content-export.json）")
    parser.add_argument("--reset", action="store_true", help="先清空 learning_items 表")
    args = parser.parse_args()

    json_path = Path(__file__).resolve().parent / args.file
    if not json_path.exists():
        print(f"✗ 找不到文件：{json_path}")
        print("  请先运行：node scripts/export-content.mjs")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if args.reset:
        db.query(LearningItem).delete()
        db.commit()
        print("✔ 已清空 learning_items")

    items = payload.get("items", [])
    created = updated = 0
    existing = {i.item_key: i for i in db.query(LearningItem).all()}

    for it in items:
        row = existing.get(it["item_key"])
        if row is None:
            row = LearningItem(
                item_key=it["item_key"],
                type=it["type"],
                level=it["level"],
                category=it.get("category", ""),
                content=it["content"],
                meaning=it.get("meaning", ""),
                phonetic=it.get("phonetic", ""),
                example=it.get("example", ""),
                example_cn=it.get("example_cn", ""),
                structure=it.get("structure", ""),
                rule=it.get("rule", ""),
                detail=it.get("detail", ""),
                tips=it.get("tips", []),
                recommend=it.get("recommend"),
                version=1,
            )
            db.add(row)
            created += 1
        else:
            # 更新内容并升版本
            row.content = it["content"]
            row.meaning = it.get("meaning", "")
            row.example = it.get("example", "")
            row.example_cn = it.get("example_cn", "")
            row.structure = it.get("structure", "")
            row.rule = it.get("rule", "")
            row.detail = it.get("detail", "")
            row.tips = it.get("tips", [])
            row.recommend = it.get("recommend")
            row.version += 1
            updated += 1

    db.commit()
    print(f"✔ 导入完成：新增 {created}，更新 {updated}，总计 {len(items)} 条内容")
    db.close()


if __name__ == "__main__":
    main()
