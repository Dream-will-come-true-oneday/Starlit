<template>
  <div class="dashboard">
    <!-- 顶部欢迎 -->
    <div class="dash-hero">
      <div>
        <h1 class="page-title">{{ greeting }}，继续加油！</h1>
        <p class="page-desc dash-kicker"><span class="signal-dot"></span>{{ todayCn }} · DAILY LEARNING CYCLE</p>
      </div>
      <div class="hero-streak">
        <AppIcon name="flame" :size="18" />
        <div class="streak-num">{{ progress.data.streakDays }}</div>
        <div class="streak-label">连续打卡（天）</div>
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="grid grid-2 today-grid">
      <!-- 今日新学 -->
      <div class="card today-card">
        <div class="card-title">
          <span class="title-with-icon"><AppIcon name="book" :size="16" /> 今日新学</span>
          <router-link to="/plan" class="more-link">查看规划 <AppIcon name="chevronRight" :size="14" /></router-link>
        </div>
        <div v-if="newItemsFlat.length" class="today-items">
          <div v-for="item in newItemsFlat" :key="item.id" class="today-item">
            <span class="dc-type-dot" :class="`type-${item.type}`"></span>
            <span class="ti-content">{{ item.content }}</span>
            <span class="ti-meaning">{{ item.meaning }}</span>
          </div>
          <div v-if="sentence.en" class="today-sentence">
            {{ sentence.en }}
          </div>
        </div>
        <div v-else class="empty-sm"><AppIcon name="check" :size="20" />今天的新学内容已全部完成</div>
        <div class="today-actions">
          <router-link :to="'/words'" class="btn btn-primary btn-sm">去学单词</router-link>
          <router-link :to="'/phrases'" class="btn btn-outline btn-sm">短语</router-link>
          <router-link :to="'/grammar'" class="btn btn-outline btn-sm">语法</router-link>
          <router-link :to="'/extra'" class="btn btn-outline btn-sm">其他</router-link>
        </div>
        <router-link to="/practice" class="practice-entry"><AppIcon name="mic" :size="16" /> 用今天学的内容，和 AI 对话练习 <AppIcon name="arrowRight" :size="14" /></router-link>
      </div>

      <!-- 今日复盘 -->
      <div class="card today-card">
        <div class="card-title">
          <span class="title-with-icon"><AppIcon name="refresh" :size="16" /> 今日复盘</span>
          <span v-if="todayReviews.length" class="badge badge-pending">{{ todayReviews.length }} 项待打卡</span>
          <span v-else class="badge badge-lit">全部完成</span>
        </div>
        <div v-if="todayReviews.length" class="review-list">
          <div v-for="r in todayReviews" :key="`${r.itemId}-${r.reviewId}`" class="review-item">
            <div class="ri-info">
              <span class="dc-type-dot" :class="`type-${r.type}`"></span>
              <span class="ri-content">{{ r.content }}</span>
              <span class="ri-label">{{ reviewLabel(r.reviewId) }}</span>
            </div>
            <ReviewCheckIn :status="r.status" :scheduled-date="r.scheduledDate" @check-in="doCheckIn(r)" />
          </div>
        </div>
        <div v-else class="empty-sm">
          <span><AppIcon name="check" :size="20" />今天没有待复盘的记忆节点</span>
          <div class="empty-sub">已按艾宾浩斯曲线（Day 1/2/4/7/15/30）自动安排</div>
        </div>
        <router-link to="/review" class="btn btn-ghost btn-sm review-link">进入复盘中心 <AppIcon name="arrowRight" :size="14" /></router-link>
      </div>
    </div>

    <!-- 进度总览 -->
    <div class="card progress-card">
      <div class="card-title">
        <span class="title-with-icon"><AppIcon name="bars" :size="16" /> 学习进度</span>
        <span class="badge badge-lv">共 {{ contentStats.total }} 个知识点</span>
      </div>
      <div class="progress-grid">
        <div v-for="m in moduleProgress" :key="m.type" class="progress-item">
          <div class="pi-head">
            <span class="pi-name" :class="`txt-${m.type}`">{{ m.label }}</span>
            <span class="pi-pct">{{ m.pct }}%</span>
          </div>
          <div class="pi-bar">
            <div class="pi-fill" :class="`fill-${m.type}`" :style="{ width: m.pct + '%' }"></div>
          </div>
          <div class="pi-sub">{{ m.learned }} 已学 / {{ m.mastered }} 已掌握</div>
        </div>
      </div>
    </div>

    <!-- 各模块难度（独立） -->
    <div class="card level-card">
      <div class="card-title">
        <span class="title-with-icon"><AppIcon name="target" :size="16" /> 各模块难度</span>
        <span class="badge">独立起点 · 互不影响</span>
      </div>
      <div v-for="m in moduleLevels" :key="m.type" class="mod-level-row">
        <span class="mod-name" :class="`txt-${m.type}`">{{ m.label }}</span>
        <span class="badge badge-lv">L{{ m.level }} {{ LEVEL_NAMES[m.level] }}</span>
        <div class="level-rail-mini">
          <div
            v-for="lv in 5"
            :key="lv"
            class="level-node"
            :class="{ active: lv === m.level, done: lv < m.level }"
          >
            <div class="ln-circle">{{ lv < m.level ? '✓' : 'L' + lv }}</div>
          </div>
        </div>
      </div>
      <p class="level-hint">各模块难度相互独立：在模块页点击更高等级标签即可调整起点（如词汇量够就跳过前面等级）。</p>
    </div>

    <!-- 数据管理 -->
    <div class="card data-card">
      <div class="card-title">
        <span class="title-with-icon"><AppIcon name="database" :size="16" /> 数据备份</span>
        <span class="badge">本地存储 · 上线后自动云同步</span>
      </div>
      <p class="data-tip">学习数据保存在浏览器本地。建议定期导出备份，换设备或清缓存前务必导出。</p>
      <div class="data-actions">
        <button class="btn btn-outline btn-sm" @click="exportData">导出 JSON 备份</button>
        <label class="btn btn-outline btn-sm file-btn">
          导入备份
          <input type="file" accept=".json" class="hidden-input" @change="onImportFile" />
        </label>
        <button class="btn btn-outline btn-sm danger-btn" @click="confirmReset">重置全部数据</button>
      </div>
      <p v-if="backupMsg" class="data-msg">{{ backupMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import ReviewCheckIn from '../components/common/ReviewCheckIn.vue'
import AppIcon from '../components/common/AppIcon.vue'
import { useProgressStore } from '../stores/progressStore.js'
import { useReviewStore } from '../stores/reviewStore.js'
import { usePlanStore } from '../stores/planStore.js'
import { useModuleStore } from '../stores/moduleStore.js'
import { contentStats } from '../data/index.js'
import { REVIEW_LABELS } from '../composables/useMemoryCurve.js'
import { today } from '../utils/date.js'

const progress = useProgressStore()
const review = useReviewStore()
const plan = usePlanStore()
const module = useModuleStore()

const LEVEL_NAMES = { 1: '日常', 2: '社交', 3: '职场', 4: '经济', 5: 'IT' }

// 四模块独立难度（由各自内容指针推导）
const moduleLevels = computed(() => [
  { type: 'word', label: '单词', level: progress.moduleLevel('word') },
  { type: 'phrase', label: '短语', level: progress.moduleLevel('phrase') },
  { type: 'grammar', label: '语法', level: progress.moduleLevel('grammar') },
  { type: 'extra', label: '其他', level: progress.moduleLevel('extra') }
])

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const todayCn = computed(() => {
  const d = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${week[d.getDay()]}`
})

// 今日计划
const todayPlan = computed(() => {
  try {
    return plan.getTodayPlan()
  } catch (e) {
    return null
  }
})

const newItemsFlat = computed(() => {
  if (!todayPlan.value) return []
  const n = todayPlan.value.newItems
  return [...n.words, ...n.phrases, ...n.grammar, ...n.extra]
})

const sentence = computed(() => (todayPlan.value ? todayPlan.value.newItems.sentence : {}))

// 今日复盘
const todayReviews = computed(() => review.todayReviews)

// 模块进度
const moduleProgress = computed(() => {
  const types = [
    { type: 'word', label: '单词' },
    { type: 'phrase', label: '短语' },
    { type: 'grammar', label: '语法' },
    { type: 'extra', label: '其他知识' }
  ]
  return types.map((t) => {
    const total = contentStats[t.type] || 1
    const s = progress.statsByType[t.type] || { learned: 0, mastered: 0 }
    return { ...t, learned: s.learned, mastered: s.mastered, pct: Math.round((s.learned / total) * 100) }
  })
})

function reviewLabel(reviewId) {
  return REVIEW_LABELS[reviewId] || `节点${reviewId + 1}`
}

function doCheckIn(r) {
  review.checkIn(r.itemId, r.reviewId)
  plan.invalidate()
  progress.syncMissed()
}

// ---- 数据管理 ----
const backupMsg = ref('')

function exportData() {
  const json = progress.exportData()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `starlit-backup-${today()}.json`
  a.click()
  URL.revokeObjectURL(url)
  backupMsg.value = '已导出备份文件 ✓'
  setTimeout(() => (backupMsg.value = ''), 3000)
}

function onImportFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      progress.importData(String(reader.result))
      plan.invalidate()
      backupMsg.value = '导入成功 ✓ 数据已恢复'
      setTimeout(() => (backupMsg.value = ''), 3000)
    } catch (err) {
      backupMsg.value = '导入失败：文件格式不正确'
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

function confirmReset() {
  if (window.confirm('⚠️ 确定要清空全部学习数据吗？此操作不可恢复，建议先导出备份！')) {
    progress.resetData()
    plan.invalidate()
    backupMsg.value = '已重置全部数据'
    setTimeout(() => (backupMsg.value = ''), 3000)
  }
}

onMounted(() => {
  progress.syncMissed()
  progress.refreshStreak()
  review.refreshTodayReviews()
})
</script>

<style scoped>
.dash-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
}

.page-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.hero-streak {
  text-align: center;
  background: rgba(16, 35, 42, 0.88);
  border: 1px solid rgba(52, 211, 153, 0.35);
  border-radius: var(--radius);
  padding: 12px 22px;
}

.streak-num {
  font-size: 32px;
  font-weight: 700;
  color: var(--lit);
  line-height: 1;
}

.streak-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.today-grid {
  margin-bottom: 20px;
}

.today-card {
  display: flex;
  flex-direction: column;
}

.more-link {
  font-size: 12px;
  color: var(--accent);
}

.today-items {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.today-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.ti-content {
  font-weight: 500;
  color: var(--text);
}

.ti-meaning {
  color: var(--text-secondary);
  font-size: 12px;
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

.today-sentence {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(100, 181, 255, 0.08);
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.today-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.practice-entry {
  display: block;
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(91, 140, 255, 0.08);
  border: 1px dashed rgba(91, 140, 255, 0.45);
  color: var(--phrase);
  font-size: 13px;
  text-align: center;
  transition: all 0.2s;
}
.practice-entry:hover {
  background: rgba(91, 140, 255, 0.16);
  border-style: solid;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.review-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 12px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
}

.ri-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ri-content {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ri-label {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.empty-sm {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 24px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-sub {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

.review-link {
  align-self: flex-start;
  margin-top: 10px;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.progress-item {
  padding: 4px 0;
}

.pi-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.pi-name {
  font-size: 13px;
  font-weight: 600;
}

.txt-word { color: var(--word); }
.txt-phrase { color: var(--phrase); }
.txt-grammar { color: var(--grammar); }
.txt-extra { color: var(--accent); }

.pi-pct {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}

.pi-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--bg-hover);
  overflow: hidden;
}

.pi-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s;
}

.fill-word { background: var(--word); }
.fill-phrase { background: var(--phrase); }
.fill-grammar { background: var(--grammar); }
.fill-extra { background: var(--accent); }

.pi-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.level-rail {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 16px 0;
}

.level-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.ln-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: var(--bg-hover);
  border: 2px solid var(--border);
  color: var(--text-muted);
}

.level-node.active .ln-circle {
  background: rgba(183, 243, 107, 0.12);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px rgba(183, 243, 107, 0.25);
}

.level-node.done .ln-circle {
  background: rgba(52, 211, 153, 0.15);
  border-color: var(--lit);
  color: var(--lit);
}

.ln-name {
  font-size: 12px;
  color: var(--text-secondary);
}

.mod-level-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border);
}
.mod-level-row:last-of-type {
  border-bottom: none;
}
.mod-name {
  width: 64px;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}
.level-rail-mini {
  display: flex;
  gap: 4px;
  flex: 1;
}
.level-rail-mini .level-node {
  flex-direction: row;
  gap: 4px;
  flex: 1;
}
.level-rail-mini .ln-circle {
  width: 24px;
  height: 24px;
  font-size: 10px;
  border-width: 1px;
}

.level-hint {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
}

.data-card {
  margin-bottom: 20px;
}

.data-tip {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.data-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.file-btn {
  position: relative;
  cursor: pointer;
}

.hidden-input {
  display: none;
}

.danger-btn {
  color: var(--missed);
  border-color: rgba(248, 113, 113, 0.4);
}

.danger-btn:hover {
  border-color: var(--missed);
  color: var(--missed);
}

.data-msg {
  margin-top: 10px;
  font-size: 12px;
  color: var(--lit);
}

@media (max-width: 768px) {
  .progress-grid {
    grid-template-columns: 1fr;
  }
}

.title-with-icon,
.more-link,
.practice-entry,
.dash-kicker,
.empty-sm > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.dash-kicker {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.dash-kicker .signal-dot {
  width: 6px;
  height: 6px;
}

.hero-streak {
  position: relative;
  min-width: 132px;
  background: rgba(16, 35, 42, 0.88);
  border-color: rgba(183, 243, 107, 0.42);
  box-shadow: var(--glow);
}

.hero-streak > svg {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--pending);
}

.practice-entry {
  justify-content: center;
  border-color: rgba(102, 227, 210, 0.38);
  background: rgba(102, 227, 210, 0.06);
  color: var(--phrase);
}

.practice-entry:hover {
  background: rgba(102, 227, 210, 0.12);
}

.empty-sm > svg {
  margin: 0 auto 8px;
  color: var(--accent);
}

@media (max-width: 768px) {
  .dash-hero {
    align-items: flex-start;
    gap: 14px;
  }

  .hero-streak {
    min-width: 104px;
    padding: 10px 12px;
  }

  .streak-num { font-size: 28px; }
  .streak-label { font-size: 10px; }
}
</style>
