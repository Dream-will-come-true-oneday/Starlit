/**
 * API 客户端（上线对接用）
 * 架构文档附录 E：Repository 层 RemoteAdapter
 *
 * 用法：
 *   import api from './api/client.js'
 *   api.baseURL = 'https://api.your-domain.com'   // 部署后配置
 *   await api.register(email, password) / api.login(...)
 *
 * token 保存在 localStorage，请求自动携带 Authorization 头
 */

const TOKEN_KEY = 'starlit:authToken'
const USER_KEY = 'starlit:authUser'

class ApiClient {
  constructor() {
    this.baseURL = '' // 同源部署留空；跨域部署填后端地址
    this.token = localStorage.getItem(TOKEN_KEY) || ''
    this.user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }

  get isLoggedIn() {
    return !!this.token
  }

  setAuth(token, user) {
    this.token = token
    this.user = user
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  clearAuth() {
    this.token = ''
    this.user = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`

    const res = await fetch(this.baseURL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `请求失败（${res.status}）`)
    }
    return res.json()
  }

  // ---- 认证 ----
  register(email, password, nickname = '') {
    return this.request('POST', '/api/auth/register', { email, password, nickname })
  }

  login(email, password) {
    return this.request('POST', '/api/auth/login', { email, password })
  }

  me() {
    return this.request('GET', '/api/auth/me')
  }

  // ---- 内容 ----
  getItems(type, level = null, offset = 0, limit = 100) {
    const q = new URLSearchParams({ type, offset, limit })
    if (level) q.set('level', level)
    return this.request('GET', `/api/items?${q}`)
  }

  // ---- 进度同步（Local-first 双写） ----
  syncProgress(items) {
    return this.request('POST', '/api/progress/sync', { items })
  }

  getSnapshot() {
    return this.request('GET', '/api/progress/snapshot')
  }

  // ---- 打卡 ----
  checkIn(itemKey, reviewId) {
    return this.request('POST', '/api/reviews/checkin', { item_key: itemKey, review_id: reviewId })
  }
}

export default new ApiClient()
