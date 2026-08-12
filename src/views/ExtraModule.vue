<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">其他知识</h1>
        <p class="page-desc">课堂上学不到的实用英语 · 含学习资源推荐</p>
      </div>
      <div class="header-stats">
        <span class="badge badge-lv">已学 {{ stats.learned }}</span>
        <span class="badge badge-lit">掌握 {{ stats.mastered }}</span>
      </div>
    </div>

    <div class="level-tabs">
      <button
        v-for="lv in 5"
        :key="lv"
        class="level-tab"
        :class="{ active: lv === currentLevel, locked: lv > unlockedLevel }"
        @click="selectLevel(lv)"
      >
        L{{ lv }} · {{ LEVEL_NAMES[lv] }}
        <span v-if="lv > unlockedLevel" class="lock">🔒</span>
      </button>
    </div>
    <p v-if="unlockedLevel < 5" class="level-tip">🔒 点击锁定等级可从该难度开始学习（跳过前面内容，已学保留）</p>

    <LearnSession ref="sessionRef" :card-component="ExtraCard" @complete="onComplete" />

    <section v-if="!sessionActive" class="card today-learn fade-in">
      <div class="card-title">
        <span>今日新学</span>
        <span class="badge badge-lv">{{ pendingItems.length }} 条待学</span>
      </div>
      <p v-if="pendingItems.length > 0" class="tl-desc">
        今天要学：{{ pendingItems.map((i) => i.content).join(' · ') }}
      </p>
      <p v-else class="tl-desc">今天的实用知识已全部学完，明天继续！</p>
      <button v-if="pendingItems.length > 0" class="btn btn-primary" @click="startLearn">
        开始学习 →
      </button>
    </section>

    <section class="learned-section">
      <h2 class="section-title"><span class="bar"></span>我的知识卡（点击查看记忆曲线）</h2>
      <ExtraList :items="learnedItems" :progress-map="progressMap" @select="selectedItem = $event" />
      <div v-if="!learnedItems.length" class="empty">
        <div class="empty-icon">🎓</div>
        <p>这个等级还没有学习记录，先学一条实用知识吧</p>
      </div>
    </section>

    <div v-if="selectedItem" class="modal-mask" @click.self="selectedItem = null">
      <div class="modal">
        <div class="modal-head">
          <div>
            <span class="modal-word">{{ selectedItem.content }}</span>
            <span class="modal-meaning">{{ selectedItem.meaning }}</span>
          </div>
          <button class="btn-ghost" @click="selectedItem = null">✕</button>
        </div>
        <MemoryCurveChart :progress="progressMap[selectedItem.id] || null" />
        <RecommendCard v-if="selectedItem.recommend" :recommend="selectedItem.recommend" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import ExtraCard from '../components/extra/ExtraCard.vue'
import ExtraList from '../components/extra/ExtraList.vue'
import LearnSession from '../components/common/LearnSession.vue'
import MemoryCurveChart from '../components/common/MemoryCurveChart.vue'
import RecommendCard from '../components/common/RecommendCard.vue'
import { useProgressStore } from '../stores/progressStore.js'
import { usePlanStore } from '../stores/planStore.js'
import { useModuleStore } from '../stores/moduleStore.js'
import { DAILY_CONFIG } from '../composables/useDailyPlan.js'

const progress = useProgressStore()
const plan = usePlanStore()
const module = useModuleStore()

const LEVEL_NAMES = { 1: '日常', 2: '社交', 3: '职场', 4: '经济', 5: 'IT' }

const currentLevel = ref(progress.moduleLevel('extra'))
const unlockedLevel = computed(() => progress.moduleLevel('extra'))
const selectedItem = ref(null)
const sessionRef = ref(null)
const sessionActive = ref(false)

const levelItems = computed(() => module.getItems('extra', currentLevel.value))

// 今日待学（从跨等级合并列表按内容指针切片，与规划视图一致）
const pendingItems = computed(() => {
  const idx = progress.contentIndex.extra
  return module.getCombined('extra').slice(idx, idx + DAILY_CONFIG.extraPerDay)
})

/** 等级标签点击：未锁直接切换；锁定等级需确认后调整本模块起点 */
function selectLevel(lv) {
  if (lv <= unlockedLevel.value) {
    currentLevel.value = lv
    return
  }
  const ok = window.confirm(
    `确定从 L${lv}（${LEVEL_NAMES[lv]}）开始学习其他知识？\n将跳过之前等级的内容，已学的知识点和打卡记录不会丢失。`
  )
  if (ok) {
    progress.setModuleLevel('extra', lv)
    currentLevel.value = lv
  }
}

const learnedItems = computed(() =>
  levelItems.value.filter((item) => progressMap.value[item.id])
)

const progressMap = computed(() => {
  const map = {}
  progress.allProgress.forEach((p) => {
    if (p.type === 'extra') map[p.itemId] = p
  })
  return map
})

const stats = computed(() => {
  let learned = 0
  let mastered = 0
  progress.allProgress.forEach((p) => {
    if (p.type === 'extra') {
      learned += 1
      if (p.isMastered) mastered += 1
    }
  })
  return { learned, mastered }
})

function startLearn() {
  sessionRef.value.start(pendingItems.value)
  sessionActive.value = true
  nextTick(() => {})
}

function onComplete(items) {
  progress.learnItems(items)
  plan.invalidate()
  sessionActive.value = false
  selectedItem.value = items[0]
}
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

.level-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.level-tab {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.level-tab:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--text);
}

.level-tab.active {
  background: rgba(139, 92, 246, 0.15);
  border-color: var(--accent);
  color: #c4b5fd;
}

.level-tab.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lock {
  margin-left: 4px;
  font-size: 11px;
}

.level-tip {
  font-size: 12px;
  color: var(--text-muted);
  margin: -10px 0 16px;
}

.today-learn {
  margin-bottom: 20px;
}

.tl-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 14px;
  line-height: 1.7;
}

.learned-section {
  margin-top: 8px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 24px;
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow);
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.modal-word {
  font-size: 20px;
  font-weight: 600;
  color: #c4b5fd;
}

.modal-meaning {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 10px;
}
</style>
