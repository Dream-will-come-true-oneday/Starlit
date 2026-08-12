"""llm 模块单元测试：格式解析 + 对话上下文构建

运行：python -m pytest backend/tests/ -v
"""
import os
import sys

# 保证 backend/ 可被 import（app 包）
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest

from app.llm import LLMClient, parse_reply_hint, parse_json_loose


@pytest.fixture
def client():
    """构造一个 LLMClient，并把 _chat 替换为假实现（不触网、不需 key）"""
    c = LLMClient()
    c._chat = lambda messages, temperature=0.7, max_tokens=200000: "[REPLY]\ndefault\n[HINT]\n默认提示"
    return c


def _spy_chat(c, canned="[REPLY]\nHi there!\n[HINT]\n提示"):
    """返回一个记录 messages 的假 _chat"""
    captured = {}

    def fake_chat(messages, temperature=0.7, max_tokens=200000):
        captured["messages"] = list(messages)
        return canned

    c._chat = fake_chat
    return captured


# ---------- parse_reply_hint ----------

def test_parse_reply_hint_with_hint():
    raw = "[REPLY]\nSure thing!\n[HINT]\n你可以这样回应：..."
    assert parse_reply_hint(raw) == {"reply": "Sure thing!", "hint": "你可以这样回应：..."}


def test_parse_reply_hint_without_hint():
    raw = "Just a plain reply."
    assert parse_reply_hint(raw) == {"reply": "Just a plain reply.", "hint": ""}


def test_parse_reply_hint_only_reply_marker():
    raw = "[REPLY]\nOk, got it."
    assert parse_reply_hint(raw) == {"reply": "Ok, got it.", "hint": ""}


# ---------- parse_json_loose ----------

def test_parse_json_loose_fenced():
    assert parse_json_loose("```json\n{\"a\": 1}\n```") == {"a": 1}


def test_parse_json_loose_surrounded_text():
    assert parse_json_loose('好的，结果是：{"x": "y"} 完毕') == {"x": "y"}


def test_parse_json_loose_invalid_returns_raw():
    r = parse_json_loose("这不是 JSON")
    assert "_raw" in r


# ---------- reply_turn 上下文构建 ----------

def test_reply_turn_opening_appears_once(client):
    """修复回归：history 首条已是开场白时，LLM messages 里开场白只能出现 1 次"""
    captured = _spy_chat(client)
    scenario = {
        "role": "咖啡店店员",
        "setting": "咖啡店",
        "goal": "点单",
        "opening": "Good morning! How are you?",
    }
    history = [
        {"role": "assistant", "content": "Good morning! How are you?"},  # 开场白（前端首条）
        {"role": "user", "content": "good morning"},
    ]
    client.reply_turn(scenario, history, ["coffee"])
    msgs = captured["messages"]
    openings = [m for m in msgs if m.get("content") == "Good morning! How are you?"]
    assert len(openings) == 1, f"开场白应只出现 1 次，实际 {len(openings)} 次: {msgs}"


def test_reply_turn_user_message_appears_once(client):
    """修复回归：当前用户发言只能出现 1 次（不能 history 和 user_text 双传）"""
    captured = _spy_chat(client)
    scenario = {"role": "店员", "opening": "Hi!"}
    history = [
        {"role": "assistant", "content": "Hi!"},
        {"role": "user", "content": "good morning"},
    ]
    client.reply_turn(scenario, history, [])
    msgs = captured["messages"]
    users = [m for m in msgs if m.get("role") == "user" and m.get("content") == "good morning"]
    assert len(users) == 1, f"用户发言应只出现 1 次，实际 {len(users)} 次: {msgs}"


def test_reply_turn_first_message_is_system(client):
    captured = _spy_chat(client)
    scenario = {"role": "店员", "opening": "Hi!"}
    history = [{"role": "assistant", "content": "Hi!"}, {"role": "user", "content": "hi"}]
    client.reply_turn(scenario, history, [])
    assert captured["messages"][0]["role"] == "system"


def test_reply_turn_truncates_history_to_last_10(client):
    captured = _spy_chat(client)
    scenario = {"role": "r", "opening": "hi"}
    history = [
        {"role": "assistant" if i % 2 == 0 else "user", "content": f"msg{i}"}
        for i in range(15)
    ]
    client.reply_turn(scenario, history, [])
    msgs = captured["messages"]
    # 1 条 system + 最近 10 条 history
    assert len(msgs) == 11
    assert msgs[-1]["content"] == "msg14"
    assert msgs[1]["content"] == "msg5"  # 被截掉的前 5 条


def test_reply_turn_empty_history_falls_back_to_opening(client):
    """history 为空时，兜底补开场白（且只补一次）"""
    captured = _spy_chat(client)
    scenario = {"role": "r", "opening": "Welcome!"}
    client.reply_turn(scenario, [], [])
    msgs = captured["messages"]
    welcomes = [m for m in msgs if m.get("content") == "Welcome!"]
    assert len(welcomes) == 1


def test_reply_turn_returns_reply_and_hint(client):
    """[REPLY]/[HINT] 正确拆成 {reply, hint}"""
    captured = _spy_chat(client, canned="[REPLY]\nSure thing!\n[HINT]\n更礼貌的说法")
    scenario = {"role": "店员", "opening": "Hi!"}
    history = [{"role": "assistant", "content": "Hi!"}, {"role": "user", "content": "hi"}]
    result = client.reply_turn(scenario, history, [])
    assert result == {"reply": "Sure thing!", "hint": "更礼貌的说法"}
