"""每日对话练习：场景生成 / 对话轮次 / 评估报告
无状态：不写数据库，LLM 现场生成
"""
from fastapi import APIRouter, HTTPException

from ..llm import LLMError, llm
from ..schemas import ScenarioRequest, TurnRequest, ReportRequest

router = APIRouter(prefix="/api/practice", tags=["practice"])


@router.post("/scenario")
def generate_scenario(req: ScenarioRequest):
    """根据当天学习内容生成对话场景"""
    if not llm.enabled:
        raise HTTPException(status_code=503, detail="未配置 DEEPSEEK_API_KEY，请先在 backend/.env 中填写")
    try:
        items = [f"{i.content}（{i.meaning}）" for i in req.items if i.content]
        scenario = llm.generate_scenario(items, req.sentence, req.level)
        return scenario
    except LLMError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.post("/turn")
def conversation_turn(req: TurnRequest):
    """对话轮次：AI 回复 + 标准回复提示"""
    if not llm.enabled:
        raise HTTPException(status_code=503, detail="未配置 DEEPSEEK_API_KEY，请先在 backend/.env 中填写")
    try:
        target_items = req.scenario.get("tips", [])
        history = list(req.history) + [{"role": "user", "content": req.user_text}]
        return llm.reply_turn(req.scenario, history, target_items)
    except LLMError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.post("/report")
def generate_report(req: ReportRequest):
    """根据对话记录生成评估报告"""
    if not llm.enabled:
        raise HTTPException(status_code=503, detail="未配置 DEEPSEEK_API_KEY，请先在 backend/.env 中填写")
    try:
        report = llm.generate_report(req.scenario, req.history, req.target_items)
        return report
    except LLMError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
