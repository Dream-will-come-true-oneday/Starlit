<template>
  <div class="plan-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">学习规划</h1>
        <p class="page-desc">时间线视图 · 过去 / 今天 / 未来 30 天每日安排</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="scrollToToday">回到今天</button>
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
      <div class="empty-icon">🗓️</div>
      <p>时间线加载中或为空</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import DayCard from '../components/common/DayCard.vue'
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
}
</style>
