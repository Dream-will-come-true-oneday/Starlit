/**
 * 内容数据 store
 * 提供四模块内容的查询能力（数据源：src/data 静态内容库）
 * 上线后此层可替换为远程 API（见附录 E RemoteAdapter）
 */
import { defineStore } from 'pinia'
import {
  contentByLevel,
  sentencesByLevel,
  getItemById,
  getItemsByType,
  getItemsCombined,
  contentStats
} from '../data/index.js'

export const useModuleStore = defineStore('module', {
  state: () => ({
    loaded: false
  }),

  getters: {
    stats: () => contentStats,
    maxLevel: () => 5
  },

  actions: {
    /** 获取某类型某等级的内容列表 */
    getItems(type, level) {
      return getItemsByType(type, level)
    },

    /** 获取某类型跨等级合并列表（今日新学切片用，与规划视图一致） */
    getCombined(type) {
      return getItemsCombined(type)
    },

    /** 按 id 获取内容 */
    getItem(id) {
      return getItemById(id)
    },

    /** 获取某等级每日句子库 */
    getSentences(level) {
      return sentencesByLevel[level] || []
    },

    /** 获取所有内容（供导出等场景） */
    getAll() {
      return Object.values(contentByLevel).flatMap((m) => [
        ...m.words,
        ...m.phrases,
        ...m.grammar,
        ...m.extra
      ])
    }
  }
})
