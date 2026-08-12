/**
 * 复盘中心 store
 * 职责：今日待复盘、逾期回顾、历史复盘记录查询
 * 数据源：progressStore 的学习进度 + 记忆曲线调度
 */
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { getTodayPendingReviews, getCurveData } from '../composables/useMemoryCurve.js'
import { getItemById } from '../data/index.js'
import { useProgressStore } from './progressStore.js'

export const useReviewStore = defineStore('review', {
  state: () => ({
    // 本地缓存：今日复盘列表（含内容详情）
    todayReviews: []
  }),

  getters: {
    /** 今日待复盘项（含完整内容信息） */
    todayReviewItems() {
      return this.todayReviews
    },

    /** 逾期（missed）复习统计 */
    missedStats() {
      const progress = useProgressStore()
      let missed = 0
      progress.allProgress.forEach((p) => {
        p.reviews.forEach((r) => {
          if (r.status === 'missed') missed += 1
        })
      })
      return missed
    }
  },

  actions: {
    /** 刷新今日复盘列表（应用启动/进入复盘页时调用） */
    refreshTodayReviews() {
      const progress = useProgressStore()
      const pending = getTodayPendingReviews(progress.data.progress)
      this.todayReviews = pending.map((r) => {
        const item = getItemById(r.itemId)
        return {
          ...r,
          content: item ? item.content : r.itemId,
          meaning: item ? item.meaning : '',
          example: item ? item.example : '',
          exampleCn: item ? item.exampleCn : '',
          learnedDate: progress.data.progress.find((p) => p.itemId === r.itemId)?.learnedDate || ''
        }
      })
    },

    /** 打卡一个复习项，返回最新状态 */
    checkIn(itemId, reviewId) {
      const progress = useProgressStore()
      progress.checkInReview(itemId, reviewId)
      this.refreshTodayReviews()
      return this.todayReviews.find((r) => r.itemId === itemId && r.reviewId === reviewId)
    },

    /** 取消打卡一个已完成复习项（误操作恢复） */
    unCheckIn(itemId, reviewId) {
      const progress = useProgressStore()
      progress.unCheckReview(itemId, reviewId)
      this.refreshTodayReviews()
      return progress.data.progress.find((p) => p.itemId === itemId) || null
    },

    /** 获取某学习项的曲线数据（记忆曲线打卡图用） */
    getCurve(itemId) {
      const progress = useProgressStore()
      const p = progress.data.progress.find((x) => x.itemId === itemId)
      return getCurveData(p)
    },

    /** 获取某学习项的进度记录 */
    getProgress(itemId) {
      const progress = useProgressStore()
      return progress.data.progress.find((x) => x.itemId === itemId) || null
    },

    /** 全部需要复盘的进度项（供复盘中心列表） */
    getAllReviewable() {
      const progress = useProgressStore()
      return progress.data.progress
        .filter((p) => p.reviews.some((r) => r.status === 'pending' || r.status === 'missed'))
        .map((p) => {
          const item = getItemById(p.itemId)
          return {
            ...p,
            content: item ? item.content : p.itemId,
            meaning: item ? item.meaning : '',
            type: p.type,
            curve: getCurveData(p)
          }
        })
        .sort((a, b) => {
          // 今天到期的最优先，其次逾期，再按学习时间
          const aToday = a.curve.some((c) => c.isToday && c.status === 'pending')
          const bToday = b.curve.some((c) => c.isToday && c.status === 'pending')
          if (aToday !== bToday) return aToday ? -1 : 1
          const aMissed = a.curve.some((c) => c.status === 'missed')
          const bMissed = b.curve.some((c) => c.status === 'missed')
          if (aMissed !== bMissed) return aMissed ? -1 : 1
          return dayjs(b.learnedDate).diff(dayjs(a.learnedDate))
        })
    }
  }
})
