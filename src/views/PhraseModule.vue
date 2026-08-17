<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h1 class="page-title">短语</h1>
        <p class="page-desc">每天 3 个地道短语 · 例句真实语境</p>
      </div>
      <div class="header-stats">
        <span class="badge badge-phrase">已学 {{ stats.learned }}</span>
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
        <span v-if="lv > unlockedLevel" class="lock"><AppIcon name="archive" :size="13" /></span>
      </button>
    </div>
    <p v-if="unlockedLevel < 5" class="level-tip"><AppIcon name="archive" :size="13" /> 点击锁定等级可从该难度开始学习（跳过前面内容，已学保留）</p>

    <!-- 学习会话 -->
    <LearnSession ref="sessionRef" :card-component="PhraseCard" @complete="onComplete" />

    <!-- 今日新学 -->
    <section v-if="!sessionActive" class="card today-learn fade-in">
      <div class="card-title">
        <span>今日新学</span>
        <span class="badge badge-phrase">{{ pendingItems.length }} 条待学</span>
      </div>
      <p v-if="pendingItems.length > 0" class="tl-desc">
        今天要学：{{ pendingItems.map((i) => i.content).join(' · ') }}
      </p>
      <p v-else class="tl-desc">今天的新短语已全部学完，明天继续！</p>
      <button v-if="pendingItems.length > 0" class="btn btn-primary" @click="startLearn">
        开始学习 <AppIcon name="play" :size="14" />
      </button>
    </section>

    <!-- 已学列表 -->
    <section class="learned-section">
      <h2 class="section-title"><span class="bar"></span>我的短语（点击查看记忆曲线）</h2>
      <PhraseList :items="learnedItems" :progress-map="progressMap" @select="selectedItem = $event" />
      <div v-if="!learnedItems.length" class="empty">
        <div class="empty-icon"><AppIcon name="chat" :size="30" /></div>
        <p>这个等级还没有学习记录，先学一组短语吧</p>
      </div>
    </section>

    <!-- 记忆曲线弹层 -->
    <div v-if="selectedItem" class="modal-mask" @click.self="selectedItem = null">
      <div class="modal">
        <div class="modal-head">
          <div>
            <span class="modal-word">{{ selectedItem.content }}</span>
            <span class="modal-meaning">{{ selectedItem.meaning }}</span>
          </div>
          <button class="btn-ghost" aria-label="关闭记忆曲线" @click="selectedItem = null"><AppIcon name="close" :size="18" /></button>
        </div>
        <MemoryCurveChart :progress="progressMap[selectedItem.id] || null" />
        <p class="modal-example">{{ selectedItem.example }}</p>
        <p class="modal-example-cn">{{ selectedItem.exampleCn }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import PhraseCard from '../components/phrase/PhraseCard.vue'
import PhraseList from '../components/phrase/PhraseList.vue'
import LearnSession from '../components/common/LearnSession.vue'
import MemoryCurveChart from '../components/common/MemoryCurveChart.vue'
import AppIcon from '../components/common/AppIcon.vue'
import { useProgressStore } from '../stores/progressStore.js'
import { usePlanStore } from '../stores/planStore.js'
import { useModuleStore } from '../stores/moduleStore.js'
import { DAILY_CONFIG } from '../composables/useDailyPlan.js'

const progress = useProgressStore()
const plan = usePlanStore()
const module = useModuleStore()

const LEVEL_NAMES = { 1: '日常', 2: '社交', 3: '职场', 4: '经济', 5: 'IT' }

const currentLevel = ref(progress.moduleLevel('phrase'))
const unlockedLevel = computed(() => progress.moduleLevel('phrase'))
const selectedItem = ref(null)
const sessionRef = ref(null)
const sessionActive = ref(false)

const levelItems = computed(() => module.getItems('phrase', currentLevel.value))

// 今日待学（从跨等级合并列表按内容指针切片，与规划视图一致）
const pendingItems = computed(() => {
  const idx = progress.contentIndex.phrase
  return module.getCombined('phrase').slice(idx, idx + DAILY_CONFIG.phrasesPerDay)
})

/** 等级标签点击：未锁直接切换；锁定等级需确认后调整本模块起点 */
function selectLevel(lv) {
  if (lv <= unlockedLevel.value) {
    currentLevel.value = lv
    return
  }
  const ok = window.confirm(
    `确定从 L${lv}（${LEVEL_NAMES[lv]}）开始学习短语？\n将跳过之前等级的内容，已学的短语和打卡记录不会丢失。`
  )
  if (ok) {
    progress.setModuleLevel('phrase', lv)
    currentLevel.value = lv
  }
}

const learnedItems = computed(() =>
  levelItems.value.filter((item) => progressMap.value[item.id])
)

const progressMap = computed(() => {
  const map = {}
  progress.allProgress.forEach((p) => {
    if (p.type === 'phrase') map[p.itemId] = p
  })
  return map
})

const stats = computed(() => {
  let learned = 0
  let mastered = 0
  progress.allProgress.forEach((p) => {
    if (p.type === 'phrase') {
      learned += 1
      if (p.isMastered) mastered += 1
    }
  })
  return { learned, mastered }
})

function startLearn() {
  sessionRef.value.start(pendingItems.value)
  sessionActive.value = true
  nextTick(() => {
    // 监听学习完成（通过 @complete 关闭入口区）
  })
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
  border-color: var(--phrase);
  color: var(--text);
}

.level-tab.active {
  background: rgba(52, 211, 153, 0.15);
  border-color: var(--phrase);
  color: var(--phrase);
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
  margin-bottom: 16px;
}

.modal-word {
  font-size: 22px;
  font-weight: 600;
  color: var(--phrase);
}

.modal-meaning {
  font-size: 15px;
  color: var(--text-secondary);
  margin-left: 10px;
}

.modal-example {
  margin-top: 14px;
  font-size: 14px;
  color: var(--text);
}

.modal-example-cn {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
</style>
