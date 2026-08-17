/**
 * 学习进度 store（AppData 核心状态）
 * 职责：等级、连续打卡、内容指针、学习进度集合的读写与持久化
 * 持久化：localStorage（Repository 模式，见 src/repositories/storage.js）
 */
import { defineStore } from 'pinia'
import { storage } from '../repositories/storage.js'
import dayjs from 'dayjs'
import { generateReviewSchedule, checkIn, unCheckIn, markMissedReviews, getTodayPendingReviews } from '../composables/useMemoryCurve.js'
import { getItemsByType, levelStartIndex, levelOfIndex } from '../data/index.js'

const STORAGE_KEY = 'appData'
const VERSION = '2.0.0'
const TYPE_KEYS = ['word', 'phrase', 'grammar', 'extra']

function defaultAppData() {
  return {
    version: VERSION,
    createdAt: dayjs().format('YYYY-MM-DD'),
    streakDays: 0,
    lastCheckInDate: null,
    contentIndex: { word: 0, phrase: 0, grammar: 0, extra: 0 },
    progress: []
  }
}

/** 旧数据迁移：v1 的全局 currentLevel → 各模块 contentIndex 起点（分模块独立难度） */
function migrate(data) {
  if (!data) return
  if (typeof data.currentLevel === 'number' && data.currentLevel >= 1 && data.currentLevel <= 5) {
    const lv = data.currentLevel
    TYPE_KEYS.forEach((t) => {
      const start = levelStartIndex(t, lv)
      if (data.contentIndex && data.contentIndex[t] < start) {
        data.contentIndex[t] = start
      }
    })
    delete data.currentLevel
    data.version = VERSION
  }
}

export const useProgressStore = defineStore('progress', {
  state: () => {
    const data = storage.get(STORAGE_KEY, null) || defaultAppData()
    migrate(data)
    return { data }
  },

  getters: {
    /** 某模块当前所处等级（由内容指针推导） */
    moduleLevel: (s) => (type) => levelOfIndex(type, s.data.contentIndex[type] || 0),
    contentIndex: (s) => s.data.contentIndex,
    allProgress: (s) => s.data.progress,

    /** 今日待复盘数量（导航红点） */
    todayReviewCount() {
      return getTodayPendingReviews(this.data.progress).length
    },

    /** 已完成学习项数量 */
    learnedCount() {
      return this.data.progress.length
    },

    /** 记忆强度分布（各等级平均） */
    statsByType() {
      const stats = { word: { learned: 0, mastered: 0 }, phrase: { learned: 0, mastered: 0 }, grammar: { learned: 0, mastered: 0 }, extra: { learned: 0, mastered: 0 } }
      this.data.progress.forEach((p) => {
        if (stats[p.type]) {
          stats[p.type].learned += 1
          if (p.isMastered) stats[p.type].mastered += 1
        }
      })
      return stats
    }
  },

  actions: {
    /** 持久化 */
    persist() {
      storage.set(STORAGE_KEY, this.data)
    },

    /**
     * 学习新内容：为 items 生成进度记录 + 记忆曲线复习计划
     * @param {Array} items 学习项列表
     */
    learnItems(items) {
      if (!items || items.length === 0) return
      const today = dayjs().format('YYYY-MM-DD')
      const existing = new Set(this.data.progress.map((p) => p.itemId))
      items.forEach((item) => {
        if (existing.has(item.id)) return
        this.data.progress.push({
          itemId: item.id,
          type: item.type,
          learnedDate: today,
          reviews: generateReviewSchedule(today),
          memoryStrength: 0,
          isMastered: false,
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
      })
      this.advanceContentIndex(items)
      this.updateStreak(today)
      this.persist()
    },

    /** 学习完成后推进内容指针（决定明天学什么） */
    advanceContentIndex(items) {
      items.forEach((item) => {
        const key = item.type === 'word' ? 'word' : item.type === 'phrase' ? 'phrase' : item.type === 'grammar' ? 'grammar' : 'extra'
        if (this.data.contentIndex[key] !== undefined) {
          this.data.contentIndex[key] += 1
        }
      })
    },

    /**
     * 复习打卡
     * @param {string} itemId
     * @param {number} reviewId
     */
    checkInReview(itemId, reviewId) {
      const progress = this.data.progress.find((p) => p.itemId === itemId)
      if (!progress) return null
      const result = checkIn(progress, reviewId)
      this.updateStreak(dayjs().format('YYYY-MM-DD'))
      this.persist()
      return result
    },

    /**
     * 取消打卡（撤销已完成复习）
     */
    unCheckReview(itemId, reviewId) {
      const progress = this.data.progress.find((p) => p.itemId === itemId)
      if (!progress) return null
      const result = unCheckIn(progress, reviewId)
      this.persist()
      return result
    },

    /** 检查并标记逾期复习（应用启动时调用） */
    syncMissed() {
      const changed = markMissedReviews(this.data.progress)
      if (changed) this.persist()
    },

    /** 连续打卡天数维护：今天有完成动作则计入 */
    updateStreak(date) {
      const today = date || dayjs().format('YYYY-MM-DD')
      const hasTodayAction = this.hasCompletedActionOn(today)
      if (!hasTodayAction) return

      if (this.data.lastCheckInDate === today) return
      // 昨天也打卡了 → 连续 +1；否则重新开始
      const yesterday = dayjs(today).subtract(1, 'day').format('YYYY-MM-DD')
      this.data.streakDays = this.data.lastCheckInDate === yesterday ? this.data.streakDays + 1 : 1
      this.data.lastCheckInDate = today
    },

    /** 今天是否有学习或打卡动作 */
    hasCompletedActionOn(date) {
      return this.data.progress.some((p) => {
        if (p.learnedDate === date) return true
        return p.reviews.some((r) => r.completedDate === date)
      })
    },

    /** 刷新连续打卡（启动时校准） */
    refreshStreak() {
      const today = dayjs().format('YYYY-MM-DD')
      if (!this.data.lastCheckInDate) return
      const diff = dayjs(today).diff(dayjs(this.data.lastCheckInDate), 'day')
      // 超过 1 天未打卡 → 连续中断
      if (diff > 1) {
        this.data.streakDays = 0
        this.persist()
      }
    },

    /**
     * 自选难度：把某模块的内容指针定位到指定等级的第一个未学项
     * 用于"词汇量 3500 但语法生疏"这类分模块独立起点的场景。
     * 回退等级不会删除已学记录或复盘记录。
     * @param {string} type word | phrase | grammar | extra
     * @param {number} level 1-5
     */
    setModuleLevel(type, level) {
      const key = TYPE_KEYS.includes(type) ? type : 'word'
      const target = Math.min(5, Math.max(1, level))
      const start = levelStartIndex(key, target)
      const levelItems = getItemsByType(key, target)
      const learnedIds = new Set(
        this.data.progress
          .filter((item) => item.type === key)
          .map((item) => item.itemId)
      )
      const firstUnlearned = levelItems.findIndex((item) => !learnedIds.has(item.id))
      const nextIndex = firstUnlearned === -1 ? start + levelItems.length : start + firstUnlearned

      if (this.data.contentIndex[key] !== nextIndex) {
        this.data.contentIndex[key] = nextIndex
        this.persist()
      }
      return target
    },

    /** 导出全部数据（JSON 备份） */
    exportData() {
      return storage.exportAll()
    },

    /** 导入备份 */
    importData(jsonStr) {
      storage.importAll(jsonStr)
      this.data = storage.get(STORAGE_KEY, null) || defaultAppData()
    },

    /** 重置全部数据 */
    resetData() {
      this.data = defaultAppData()
      this.persist()
    }
  }
})
