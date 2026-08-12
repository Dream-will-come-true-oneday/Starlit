/**
 * 每日学习计划 store
 * 职责：生成并缓存每日学习计划（含四模块新学 + 每日句子 + 复盘项）
 */
import { defineStore } from 'pinia'
import { generateDailyPlan, generatePlanRange, DAILY_CONFIG } from '../composables/useDailyPlan.js'
import { useProgressStore } from './progressStore.js'
import { today, addDays } from '../utils/date.js'

export const usePlanStore = defineStore('plan', {
  state: () => ({
    // 时间线缓存：{ startDate, plans: [...] }
    timeline: null,
    planCache: new Map()
  }),

  getters: {
    dailyConfig: () => DAILY_CONFIG
  },

  actions: {
    /** 生成今日计划 */
    getTodayPlan() {
      const progress = useProgressStore()
      return this.getPlanFor(today(), progress.contentIndex, progress.allProgress)
    },

    /** 生成指定日期计划（带缓存） */
    getPlanFor(date, contentIndex, allProgress) {
      const cacheKey = `${date}|${contentIndex.word}|${contentIndex.phrase}|${contentIndex.grammar}|${contentIndex.extra}`
      if (this.planCache.has(cacheKey)) return this.planCache.get(cacheKey)
      const plan = generateDailyPlan(date, contentIndex, allProgress)
      // 缓存上限控制，防止无限增长
      if (this.planCache.size > 200) this.planCache.clear()
      this.planCache.set(cacheKey, plan)
      return plan
    },

    /** 生成时间线（过去 7 天 + 今天 + 未来 30 天） */
    loadTimeline(pastDays = 7, futureDays = 30) {
      const progress = useProgressStore()
      const startDate = addDays(today(), -pastDays)
      const totalDays = pastDays + 1 + futureDays
      const plans = generatePlanRange(startDate, totalDays, progress.contentIndex, progress.allProgress)
      this.timeline = { startDate, plans }
      return plans
    },

    /** 清除缓存（学习/打卡后调用，保证计划刷新） */
    invalidate() {
      this.planCache.clear()
      this.timeline = null
    }
  }
})
