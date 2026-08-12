/**
 * 每日对话练习 API（无状态，无需登录）
 * 场景生成 / 对话轮次 / 评估报告
 */
import api from './client.js'

// 本地联调默认打 8000；部署后前端配置 api.baseURL（同源或跨域 API 域名）自动生效
const BASE = api.baseURL || 'http://localhost:8000'

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `请求失败（${res.status}）`)
  }
  return res.json()
}

/** 根据当天学习内容生成对话场景 */
export function generateScenario(items, sentence, level) {
  return post('/api/practice/scenario', { items, sentence, level })
}

/** 对话轮次：AI 扮演角色回复 */
export function sendTurn(scenario, history, userText) {
  return post('/api/practice/turn', { scenario, history, user_text: userText })
}

/** 生成评估报告 */
export function generateReport(scenario, history, targetItems) {
  return post('/api/practice/report', { scenario, history, target_items: targetItems })
}
