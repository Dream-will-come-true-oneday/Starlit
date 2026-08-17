<template>
  <div class="plan-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">学习规划</h1>
        <p class="page-desc">时间线视图 · 过去 / 今天 / 未来 30 天每日安排</p>
      </div>
      <div class="header-actions">
        <router-link to="/practice" class="btn btn-outline btn-sm"><AppIcon name="mic" :size="14" /> 对话练习</router-link>
        <button class="btn btn-outline btn-sm" @click="scrollToToday"><AppIcon name="target" :size="14" /> 回到今天</button>
      </div>
    </div>

    <!-- 概览统计 -->
    <div class="grid grid-3 plan-stats">
      <div class="card stat-card">
        <div class="stat-num">{{ todayPlan?.completion.newTotal || 0 }}</div>
        <div class="stat-label">今日新学</div>
      </div>
      <div class="card stat-card">
        <div class="stat-num">{{ todayPlan?.completion.reviewTotal || 0 }}</div>
        <div class="stat-label">今日复盘</div>
      </div>
      <div class="card stat-card">
        <div class="stat-num">{{ timelinePlans.length }}</div>
        <div class="stat-label">时间线总天数</div>
      </div>
    </div>

    <!-- 时间线 -->
    <div class="timeline" ref="timelineRef">
      <div v-for="plan in timelinePlans" :key="plan.date" :ref="setCardRef(plan.date)" class="timeline-item">
        <DayCard :plan="plan" :default-expanded="plan.dayStatus === 'today'" />
      </div>
    </div>

    <div v-if="!timelinePlans.length" class="empty">
      <div class="empty-icon"><AppIcon name="calendar" :size="30" /></div>
      <p>时间线加载中或为空</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DayCard from '../components/common/DayCard.vue'
import AppIcon from '../components/common/AppIcon.vue'
import { usePlanStore } from '../stores/planStore.js'
import { useProgressStore } from '../stores/progressStore.js'
import { today } from '../utils/date.js'

const planStore = usePlanStore()
const progress = useProgressStore()

const timelineRef = ref(null)
const cardRefs = {}

const timelinePlans = computed(() => planStore.timeline?.plans || [])

const todayPlan = computed(() =>
  timelinePlans.value.find((p) => p.date === today()) || null
)

function setCardRef(date) {
  return (el) => {
    if (el) cardRefs[date] = el
  }
}

function scrollToToday() {
  const el = cardRefs[today()]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  progress.syncMissed()
  planStore.loadTimeline(7, 30)
  nextTick(() => {
    // 初始定位到今天
    const el = cardRefs[today()]
    if (el && el.scrollIntoView) {
      setTimeout(() => el.scrollIntoView({ block: 'start' }), 100)
    }
  })
})
</script>

<style scoped>
.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.header-actions {
  display: flex;
  gap: 8px;
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

.plan-stats {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 14px;
  left: 14px;
  height: 2px;
  background: var(--accent);
  opacity: 0.6;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.timeline {
  display: flex;
  flex-direction: column;
  scroll-margin-top: 80px;
  position: relative;
}

.timeline-item {
  scroll-margin-top: 88px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 38px;
  width: 1px;
  background: rgba(102, 227, 210, 0.18);
  pointer-events: none;
}

.header-actions .btn {
  gap: 6px;
}

@media (max-width: 600px) {
  .module-header {
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions { flex-shrink: 0; }
  .header-actions .btn { padding-inline: 10px; }
}
</style>
