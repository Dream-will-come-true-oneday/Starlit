/**
 * localStorage Repository 适配器
 *
 * 设计说明：
 * - 数据层与业务层解耦：所有读写都通过本模块，未来可替换为 IndexedDB 或后端 API
 * - 统一 JSON 序列化 + 版本标记，便于迁移
 */

const PREFIX = 'starlit:'

export const storage = {
  /**
   * 读取数据，损坏或缺失时返回默认值
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch (e) {
      console.warn(`[storage] 读取 ${key} 失败，使用默认值`, e)
      return fallback
    }
  },

  /**
   * 写入数据
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error(`[storage] 写入 ${key} 失败`, e)
      return false
    }
  },

  /**
   * 删除数据
   */
  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },

  /**
   * 导出全部学习数据（JSON 备份）
   */
  exportAll() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX))
    const data = {}
    keys.forEach((k) => {
      data[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k))
    })
    return JSON.stringify(data, null, 2)
  },

  /**
   * 导入备份数据（整体覆盖）
   */
  importAll(jsonStr) {
    const data = JSON.parse(jsonStr)
    Object.keys(data).forEach((k) => {
      localStorage.setItem(PREFIX + k, JSON.stringify(data[k]))
    })
  }
}
