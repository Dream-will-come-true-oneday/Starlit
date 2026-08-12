<template>
  <div class="review-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">复盘中心</h1>
        <p class="page-desc">记忆曲线打卡 · 今天到期的最优先</p>
      </div>
      <div class="header-stats">
        <span class="badge badge-pending">{{ todayReviews.length }} 今日待办</span>
        <span class="badge badge-missed">{{ review.missedStats }} 已逾期</span>
      </div>
    </div>

    <!-- 今日待复盘 -->
    <section class="card review-section">
      <div class="card-title">
        <span>🔁 今日待复盘</span>
        <span v-if="todayReviews.length" class="badge badge-pending">{{ todayReviews.length }} 项</span>
      </div>
      <div v-if="todayReviews.length" class="review-list">
        <div v-for="r in todayReviews" :key="`${r.itemId}-${r.reviewId}`" class="review-item">
          <div class="ri-main">
            <span class="dc-type-dot" :class="`type-${r.type}`"></span>
            <div class="ri-text">
              <div class="ri-content">{{ r.content }}</div>
              <div class="ri-meaning">{{ r.meaning }}</div>
            </div>
          </div>
          <div class="ri-side">
            <span class="ri-label">{{ reviewLabel(r.reviewId) }}</span>
            <ReviewCheckIn
            :status="r.status"
            :scheduled-date="r.scheduledDate"
            @check-in="doCheckIn(r)"
            @un-check-in="doUnCheckIn(r)"
          />
          </div>
        </div>
      </div>
      <div v-else class="empty-sm">
        🎉 今日记忆节点已全部完成，太棒了！
        <div class="empty-sub">记忆曲线（Day 1/2/4/7/15/30）会在到期日自动提醒你</div>
      </div>
    </section>

    <!-- 全部待复习项（含逾期） -->
    <section class="review-section">
      <h2 class="section-title"><span class="bar"></span>全部复习项（{{ allReviewable.length }}）</h2>
      <div v-if="allReviewable.length" class="card list-card">
        <div v-for="p in allReviewable" :key="p.itemId" class="list-item" @click="selectedId = selectedId === p.itemId ? null : p.itemId">
          <div class="li-head">
            <span class="dc-type-dot" :class="`type-${p.type}`"></span>
            <span class="li-content">{{ p.content }}</span>
            <span class="li-meaning">{{ p.meaning }}</span>
            <span class="li-badge">
              <span v-if="p.curve.some((c) => c.isToday && c.status === 'pending')" class="badge badge-pending">今日</span>
              <span v-else-if="p.curve.some((c) => c.status === 'missed')" class="badge badge-missed">有逾期</span>
              <span v-else class="badge">学习中</span>
            </span>
            <span class="li-arrow" :class="{ open: selectedId === p.itemId }">▾</span>
          </div>
          <div v-if="selectedId === p.itemId" class="li-body">
            <MemoryCurveChart
              :progress="p"
              @check-in="(e) => doCurveCheckIn(p.itemId, e.reviewId)"
              @un-check-in="(e) => doCurveUnCheckIn(p.itemId, e.reviewId)"
            />
            <p class="li-tip">点击曲线节点打卡 / 取消打卡</p>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <div class="empty-icon">🗂️</div>
        <p>还没有需要复习的内容，先学一些新知识吧</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MemoryCurveChart from '../components/common/MemoryCurveChart.vue'
import ReviewCheckIn from '../components/common/ReviewCheckIn.vue'
import { useReviewStore } from '../stores/reviewStore.js'
import { useProgressStore } from '../stores/progressStore.js'
import { usePlanStore } from '../stores/planStore.js'
import { REVIEW_LABELS } from '../composables/useMemoryCurve.js'

const review = useReviewStore()
const progress = useProgressStore()
const plan = usePlanStore()

const selectedId = ref(null)

const todayReviews = computed(() => review.todayReviews)
const allReviewable = computed(() => review.getAllReviewable())

function reviewLabel(reviewId) {
  return REVIEW_LABELS[reviewId] || `节点${reviewId + 1}`
}

function doCheckIn(r) {
  review.checkIn(r.itemId, r.reviewId)
  plan.invalidate()
  progress.syncMissed()
}

function doUnCheckIn(r) {
  review.unCheckIn(r.itemId, r.reviewId)
  plan.invalidate()
  progress.syncMissed()
}

function doCurveCheckIn(itemId, reviewId) {
  review.checkIn(itemId, reviewId)
  plan.invalidate()
  progress.syncMissed()
}

function doCurveUnCheckIn(itemId, reviewId) {
  review.unCheckIn(itemId, reviewId)
  plan.invalidate()
  progress.syncMissed()
}

onMounted(() => {
  progress.syncMissed()
  review.refreshTodayReviews()
})
</script>

<style scoped>
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
}

.page-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.review-section {
  margin-bottom: 20px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.ri-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dc-type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.type-word { background: var(--word); }
.type-phrase { background: var(--phrase); }
.type-grammar { background: var(--grammar); }
.type-extra { background: var(--accent); }

.ri-text {
  min-width: 0;
}

.ri-content {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
}

.ri-meaning {
  font-size: 12px;
  color: var(--text-secondary);
}

.ri-side {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.ri-label {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 999px;
}

.empty-sm {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 28px 0;
}

.empty-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

.list-card {
  padding: 8px;
}

.list-item {
  border-radius: var(--radius-sm);
  transition: background 0.15s;
  cursor: pointer;
}

.list-item:hover {
  background: var(--bg-soft);
}

.li-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
}

.li-content {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.li-meaning {
  font-size: 12px;
  color: var(--text-secondary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.li-badge {
  flex-shrink: 0;
}

.li-arrow {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.li-arrow.open {
  transform: rotate(180deg);
}

.li-body {
  padding: 8px 12px 16px;
  border-top: 1px dashed var(--border);
}

.li-curve-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.li-tip {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
  text-align: center;
}
</style>
