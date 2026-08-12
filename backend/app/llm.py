"""LLM 客户端封装（DeepSeek，预留切换其它提供商）

职责：场景生成 / 对话回复 / 评估报告 三个能力，统一走 chat/completions
"""
import json
import re
from typing import List, Dict, Any

import httpx

from .config import settings


class LLMError(Exception):
    """LLM 调用失败"""


# 输出 token 上限统一放大到 20 万：这只是"上限"不是"强制输出"，
# 成本按实际输出计费；给推理模型最大余量，彻底避免"思考吃满 token 导致 content 为空"
MAX_OUTPUT_TOKENS = 200000


class LLMClient:
    """OpenAI 兼容协议的 LLM 客户端（默认 DeepSeek）"""

    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.base_url = settings.DEEPSEEK_BASE_URL
        self.model = settings.DEEPSEEK_MODEL
        self.timeout = 60.0

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    def _chat(self, messages: List[Dict[str, str]], temperature: float = 0.7, max_tokens: int = MAX_OUTPUT_TOKENS) -> str:
        if not self.enabled:
            raise LLMError("未配置 DEEPSEEK_API_KEY，请在 backend/.env 中填写")
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False,
        }
        last_err = "模型未返回可用内容（推理模型可能超出 max_tokens 上限），请重试"
        for attempt in range(2):  # 最多尝试 2 次：推理模型偶发把 token 全吃了，重试通常能拿到内容
            try:
                resp = httpx.post(
                    f"{self.base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json=payload,
                    timeout=self.timeout,
                    trust_env=False,  # 忽略系统代理环境变量（避免本地/服务器代理干扰）
                )
                resp.raise_for_status()
                data = resp.json()
                msg = data["choices"][0]["message"]
                content = (msg.get("content") or "").strip()
                if content:
                    return content
                # content 为空：不退 reasoning_content（含中文思考），重试
            except httpx.HTTPStatusError as e:
                raise LLMError(f"LLM 接口错误 {e.response.status_code}: {e.response.text[:300]}") from e
            except Exception as e:  # noqa: BLE001
                if attempt == 1:
                    raise LLMError(f"LLM 调用失败: {e}") from e
        raise LLMError(last_err)

    def _chat_json(self, messages: List[Dict[str, str]], temperature: float = 0.4, max_tokens: int = MAX_OUTPUT_TOKENS) -> Dict[str, Any]:
        """请求 LLM 返回 JSON，并容错解析（剥离 markdown 代码块等）"""
        text = self._chat(messages, temperature=temperature, max_tokens=max_tokens)
        return parse_json_loose(text)

    # ---------- 三个业务能力 ----------

    def generate_scenario(self, items: List[str], sentence: str, level: int) -> Dict[str, Any]:
        """根据当天学习内容生成对话场景"""
        items_txt = "\n".join(f"- {i}" for i in items) if items else "- （今天暂无新学内容）"
        sys = (
            "你是英语学习场景设计师。根据用户今天学习的内容，设计一个贴近真实生活的英语对话场景，"
            "场景要自然融入今天学的单词/短语，难度匹配用户的当前等级（L1最基础~L5专业）。"
            "只返回 JSON，不要输出其它内容。"
        )
        user = f"""今天学习的内容：
单词/短语/语法/实用知识：
{items_txt}

每日句子：{sentence}

当前等级：L{level}

请返回 JSON，结构如下：
{{
  "title": "场景标题（中文，一句话）",
  "setting": "场景背景描述（中文，说明在什么场合、发生了什么）",
  "role": "AI 扮演的角色（中文，如：咖啡店店员）",
  "goal": "你的目标（中文，如：点一杯拿铁并询问营业时间）",
  "tips": ["短语级别表达1（2-5 个词，可直接套用，如 'Could I have'）", "短语2", "短语3"],
  "respond_hint": "用户第一轮该怎么回应 AI 的开场白（中文一句话 + 一个英语示例句，如：你可以这样打招呼回应：'Hi! Nice to meet you too. I'm doing great, thanks.'）",
  "opening": "AI 扮演角色说的开场白（英语，1-2 句）"
}}"""
        return self._chat_json([{"role": "system", "content": sys}, {"role": "user", "content": user}])

    def reply_turn(self, scenario: Dict[str, Any], history: List[Dict[str, str]], target_items: List[str]) -> Dict[str, str]:
        """对话轮次：AI 回复 + 给用户的标准回复提示
        返回 {"reply": 英语台词, "hint": 中文提示}
        """
        items_txt = "、".join(target_items) if target_items else "（无特定目标表达，自然对话即可）"
        sys = (
            f"你是{scenario.get('role', '场景角色')}，场景：{scenario.get('setting', '')}。\n"
            f"用户的目标：{scenario.get('goal', '')}。\n"
            f"今天用户学过的表达（在合适时机自然引导他/她用出来，不要生硬）：{items_txt}\n"
            "请用英语自然、口语化地回复，不超过 3 句，像真人一样推进对话，并适时引导用户开口。\n"
            '请严格按以下格式输出：\n'
            '[REPLY]\n你的英语台词（只写台词，不要任何多余文字）\n'
            '[HINT]\n给用户的中文提示：这句话更标准/更自然的说法（可带例句）、以及下一句可以怎么接（1-3 句，简短实用）'
        )
        msgs: List[Dict[str, str]] = [{"role": "system", "content": sys}]
        # 开场白已包含在 history 首条 assistant 消息里；仅当 history 为空时兜底补上，避免重复
        opening = scenario.get("opening", "")
        if opening and not history:
            msgs.append({"role": "assistant", "content": opening})
        for h in history[-10:]:  # 只保留最近 10 条，控制上下文
            role = "user" if h.get("role") == "user" else "assistant"
            msgs.append({"role": role, "content": h.get("content", "")})
        raw = self._chat(msgs, temperature=0.8, max_tokens=MAX_OUTPUT_TOKENS)
        return parse_reply_hint(raw)

    def generate_report(self, scenario: Dict[str, Any], history: List[Dict[str, str]], target_items: List[str]) -> Dict[str, Any]:
        """根据对话记录生成评估报告"""
        transcript = "\n".join(
            f"{'用户' if h.get('role') == 'user' else 'AI'}: {h.get('content', '')}"
            for h in history
        )
        items_txt = "\n".join(f"- {i}" for i in target_items) if target_items else "- 无"
        sys = (
            "你是专业的英语口语评估教练。根据一段英语对话练习记录，评估学习者的表现并给出改进建议。"
            "评估维度：grammar(语法准确度)、vocabulary(词汇运用，是否用上今天学的词)、fluency(流利度，停顿/重复/沉默)、relevance(表达贴题，是否回应对方)。"
            "只返回 JSON，不要输出其它内容。"
        )
        user = f"""场景：{scenario.get('title', '')}｜{scenario.get('setting', '')}
角色：{scenario.get('role', '')}
目标：{scenario.get('goal', '')}

今天的学习目标词汇/短语：
{items_txt}

对话记录：
{transcript if transcript else "（用户未发言或对话过短）"}

请返回 JSON，结构如下：
{{
  "scores": {{"grammar": 7, "vocabulary": 6, "fluency": 8, "relevance": 9, "overall": 8}},
  "weak_points": ["薄弱点1（中文，具体到哪句话哪个点）", "薄弱点2"],
  "strengths": ["做得好的地方1", "做得好的地方2"],
  "used_target_items": ["用上了的目标表达（没有则空数组）"],
  "missed_target_items": ["没机会用/没用上的目标表达（没有则空数组）"],
  "improvements": ["针对薄弱点的具体改进练习1", "改进练习2"],
  "suggestions": ["学习建议1，如：明天复习哪些内容、推荐练习方法"],
  "analysis": "对本次练习的总体解析（中文 2-4 句）：哪些地方该主动提问/追问、怎样接话更自然、整体表现如何",
  "example_exchanges": [
    {{"ai": "AI 说的某句话", "you": "你当时的回答", "better": "更标准/更自然的回应（英语）", "note": "为什么这样说更好（中文）"}}
  ]
}}
分数范围 1-10。如果对话太短无法评估，分数给 5，并在 suggestions 里建议多练几轮。example_exchanges 最多 3 组，选最有代表性的。"""
        return self._chat_json([{"role": "system", "content": sys}, {"role": "user", "content": user}], temperature=0.3, max_tokens=MAX_OUTPUT_TOKENS)


def parse_json_loose(text: str) -> Dict[str, Any]:
    """从 LLM 输出中容错解析 JSON（处理 markdown 代码块、前后缀文字）"""
    text = text.strip()
    # 去掉 ```json ... ``` 包裹
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    # 从第一个 { 截取到最后一个 }
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # 兜底：暴力提取键值对中的字符串，拼一个最小结构
        return {"_raw": text}


def parse_reply_hint(raw: str) -> Dict[str, str]:
    """解析对话回复的 [REPLY]/[HINT] 格式；缺 HINT 时 hint 为空字符串"""
    text = raw.strip()
    hint = ""
    if "[HINT]" in raw:
        head, tail = raw.split("[HINT]", 1)
        text = head
        hint = tail.strip()
    reply = text.replace("[REPLY]", "").strip()
    return {"reply": reply, "hint": hint}


llm = LLMClient()
