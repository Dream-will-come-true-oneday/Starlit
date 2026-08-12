/**
 * 记忆曲线核心逻辑
 * 艾宾浩斯复习间隔 + 复习计划生成 + 状态流转
 */
import dayjs from 'dayjs'

/** 艾宾浩斯复习间隔（天） */
export const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30]

/** 复习节点说明文案 */
export const REVIEW_LABELS = ['第1天', '第2天', '第4天', '第7天', '第15天', '第30天']

/**
 * 学完一个知识点时调用，生成 6 个复习节点
 * @param {string} learnedDate 学习日期 YYYY-MM-DD
 */
export function generateReviewSchedule(learnedDate) {
  return REVIEW_INTERVALS.map((days, index) => ({
    reviewId: index,
    scheduledDate: dayjs(learnedDate).add(days, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    completedDate: null
  }))
}

/**
 * 打卡：完成一次复习
 * 规则：仅 pending 可打卡；打卡后节点点亮（completed）
 */
export function checkIn(progress, reviewId) {
  const review = progress.reviews.find((r) => r.reviewId === reviewId)
  if (review && review.status === 'pending') {
    review.status = 'completed'
    review.completedDate = dayjs().format('YYYY-MM-DD')
  }
  refreshProgressMeta(progress)
  return progress
}

/**
 * 取消打卡：撤销一次已完成复习（误操作恢复）
 * 规则：仅 completed 可取消；节点回到 pending
 */
export function unCheckIn(progress, reviewId) {
  const review = progress.reviews.find((r) => r.reviewId === reviewId)
  if (review && review.status === 'completed') {
    review.status = 'pending'
    review.completedDate = null
  }
  refreshProgressMeta(progress)
  return progress
}

/** 重新计算记忆强度与已掌握标记 */
function refreshProgressMeta(progress) {
  progress.memoryStrength = Math.round(
    (progress.reviews.filter((r) => r.status === 'completed').length / REVIEW_INTERVALS.length) * 100
  )
  progress.isMastered = progress.reviews.every((r) => r.status === 'completed')
  progress.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 检查并标记逾期复习为 missed（熄灭）
 * 规则：到期日 < 今天 且仍为 pending → missed
 */
export function markMissedReviews(allProgress) {
  const today = dayjs().format('YYYY-MM-DD')
  let changed = false
  allProgress.forEach((item) => {
    item.reviews.forEach((r) => {
      if (r.status === 'pending' && r.scheduledDate < today) {
        r.status = 'missed'
        changed = true
      }
    })
  })
  return changed
}

/**
 * 获取某一天需要复盘的所有复习项（含状态）
 */
export function getReviewsOnDate(allProgress, date) {
  const result = []
  allProgress.forEach((item) => {
    item.reviews.forEach((r) => {
      if (r.scheduledDate === date) {
        result.push({
          itemId: item.itemId,
          type: item.type,
          reviewId: r.reviewId,
          status: r.status,
          scheduledDate: r.scheduledDate
        })
      }
    })
  })
  return result
}

/**
 * 获取今天待复盘的复习项（pending 且到期）
 */
export function getTodayPendingReviews(allProgress) {
  const today = dayjs().format('YYYY-MM-DD')
  return allProgress
    .filter((item) => item.reviews.some((r) => r.scheduledDate === today && r.status === 'pending'))
    .flatMap((item) =>
      item.reviews
        .filter((r) => r.scheduledDate === today && r.status === 'pending')
        .map((r) => ({ itemId: item.itemId, type: item.type, reviewId: r.reviewId }))
    )
}

/**
 * 获取某学习项的完整复习状态（用于记忆曲线图）
 * 返回：6 个节点，每个含 scheduledDate/status/是否点亮
 */
export function getCurveData(progress) {
  if (!progress) return []
  const today = dayjs().format('YYYY-MM-DD')
  return REVIEW_INTERVALS.map((days, index) => {
    const review = progress.reviews[index]
    const scheduledDate = review ? review.scheduledDate : dayjs(progress.learnedDate).add(days, 'day').format('YYYY-MM-DD')
    return {
      reviewId: index,
      label: REVIEW_LABELS[index],
      days,
      scheduledDate,
      status: review ? review.status : 'pending',
      isLit: review ? review.status === 'completed' : false,
      isPast: scheduledDate < today,
      isToday: scheduledDate === today
    }
  })
}
