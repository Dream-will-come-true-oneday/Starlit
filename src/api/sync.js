/**
 * 进度同步工具（Local-first 双写引擎）
 *
 * 工作方式：
 * 1. 本地操作先写 localStorage（离线可用，现有逻辑不变）
 * 2. 联网时调用本工具，把本地进度增量同步到云端
 * 3. 首次登录时拉取云端快照合并到本地
 *
 * 接入点建议：
 * - 登录成功后 → fullSyncFromCloud()
 * - 每次 learnItems / checkInReview 后 → 调用 syncLocalToCloud()（可节流）
 */
import api from './client.js'
import { useProgressStore } from '../stores/progressStore.js'

/** 本地进度 → 云端同步格式 */
function buildSyncPayload(progress) {
  return progress.map((p) => ({
    item_key: p.itemId,
    type: p.type,
    learned_date: p.learnedDate,
    memory_strength: p.memoryStrength,
    is_mastered: p.isMastered,
    reviews: p.reviews.map((r) => ({
      review_id: r.reviewId,
      scheduled_date: r.scheduledDate,
      status: r.status,
      completed_date: r.completedDate || null,
      updated_at: p.updatedAt || null
    }))
  }))
}

/** 云端快照 → 本地 progress 格式 */
function toLocalProgress(item) {
  return {
    itemId: item.item_key,
    type: item.type,
    learnedDate: item.learned_date,
    reviews: item.reviews.map((r) => ({
      reviewId: r.review_id,
      scheduledDate: r.scheduled_date,
      status: r.status,
      completedDate: r.completed_date
    })),
    memoryStrength: item.memory_strength,
    isMastered: item.is_mastered,
    updatedAt: null
  }
}

/**
 * 把本地进度全量同步到云端（增量同步的精简版：全量覆盖，适合小规模）
 * @returns {Promise<object>} 同步结果
 */
export async function syncLocalToCloud() {
  const progress = useProgressStore()
  const payload = buildSyncPayload(progress.data.progress)
  const result = await api.syncProgress(payload)
  return result
}

/**
 * 从云端拉取快照合并到本地
 * 冲突策略：云端"已打卡"优先（不可逆操作）；其余以本地为准
 */
export async function pullFromCloud() {
  const progress = useProgressStore()
  const snapshot = await api.getSnapshot()
  if (!snapshot.items || snapshot.items.length === 0) return 0

  const localMap = {}
  progress.data.progress.forEach((p) => {
    localMap[p.itemId] = p
  })

  let merged = 0
  snapshot.items.forEach((cloudItem) => {
    const local = localMap[cloudItem.item_key]
    if (!local) {
      progress.data.progress.push(toLocalProgress(cloudItem))
      merged += 1
      return
    }
    // 合并复习状态：云端已打卡 → 本地补上
    cloudItem.reviews.forEach((cr) => {
      const lr = local.reviews.find((r) => r.reviewId === cr.review_id)
      if (cr.status === 'completed' && (!lr || lr.status !== 'completed')) {
        if (lr) {
          lr.status = 'completed'
          lr.completedDate = cr.completed_date
        } else {
          local.reviews.push({
            reviewId: cr.review_id,
            scheduledDate: cr.scheduled_date,
            status: 'completed',
            completedDate: cr.completed_date
          })
        }
        merged += 1
      }
    })
  })

  progress.persist()
  return merged
}

/**
 * 首次登录的全量同步：先拉云端，再推本地
 */
export async function fullSync() {
  await pullFromCloud()
  await syncLocalToCloud()
}
