<template>
  <div class="day-card" :class="`day-${plan.dayStatus}`">
    <!-- 卡片头 -->
    <div class="dc-head" @click="expanded = !expanded">
      <div class="dc-date">
        <div class="dc-day">{{ dayNum }}</div>
        <div class="dc-meta">
          <div class="dc-weekday">{{ weekday }}</div>
          <div class="dc-month">{{ monthLabel }}</div>
        </div>
      </div>

      <div class="dc-status">
        <span v-if="plan.dayStatus === 'today'" class="badge badge-lit">今天</span>
        <span v-else-if="plan.dayStatus === 'past'" class="badge">已过去</span>
        <span v-else class="badge badge-pending">未来</span>
      </div>

      <div class="dc-progress">
        <span class="dc-progress-text">
          新学 {{ plan.completion.newCompleted }}/{{ plan.completion.newTotal }}
          · 复盘 {{ plan.completion.reviewCompleted }}/{{ plan.completion.reviewTotal }}
        </span>
        <div class="dc-bar">
          <div
            class="dc-bar-fill"
            :style="{ width: progressPct + '%' }"
            :class="{ done: progressPct >= 100 }"
          ></div>
        </div>
      </div>

      <span class="dc-arrow" :class="{ open: expanded }">▾</span>
    </div>

    <!-- 展开详情 -->
    <div v-show="expanded" class="dc-body">
      <!-- 每日句子 -->
      <div v-if="plan.newItems.sentence.en" class="dc-sentence">
        <div class="dc-section-label">📌 每日句子</div>
        <div class="dc-sentence-en">{{ plan.newItems.sentence.en }}</div>
        <div class="dc-sentence-cn">{{ plan.newItems.sentence.cn }}</div>
      </div>

      <!-- 新学内容（四模块） -->
      <div v-if="hasNewItems" class="dc-new">
        <div class="dc-section-label">📚 今日新学</div>
        <div class="dc-new-grid">
          <div v-for="item in newItemsFlat" :key="item.id" class="dc-item">
            <span class="dc-type-dot" :class="`type-${item.type}`"></span>
            <span class="dc-item-content">{{ item.content }}</span>
            <span class="dc-item-meaning">{{ item.meaning }}</span>
          </div>
        </div>
      </div>

      <!-- 复盘项 -->
      <div v-if="plan.reviewItems.length" class="dc-review">
        <div class="dc-section-label">🔁 今日复盘（{{ plan.reviewItems.length }}）</div>
        <div class="dc-review-list">
          <div v-for="(r, i) in plan.reviewItems" :key="i" class="dc-review-item">
            <span class="dc-type-dot" :class="`type-${r.type}`"></span>
            <span class="dc-review-content">{{ reviewContent(r) }}</span>
            <span class="dc-review-status" :class="`st-${r.status}`">
              {{ r.status === 'completed' ? '✓ 已打卡' : r.status === 'missed' ? '✕ 逾期' : '待打卡' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!hasNewItems && !plan.reviewItems.length" class="dc-empty">
        这一天暂无安排
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getItemById } from '../../data/index.js'

const props = defineProps({
  plan: { type: Object, required: true },
  /** 默认展开 */
  defaultExpanded: { type: Boolean, default: false }
})

const expanded = ref(props.defaultExpanded)

const dayNum = computed(() => props.plan.date.slice(8, 10))
const monthLabel = computed(() => `${props.plan.date.slice(5, 7)}月`)
const weekday = computed(() => {
  const d = new Date(props.plan.date + 'T00:00:00')
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[d.getDay()]
})

const newItemsFlat = computed(() => {
  const n = props.plan.newItems
  return [...n.words, ...n.phrases, ...n.grammar, ...n.extra]
})

const hasNewItems = computed(() => newItemsFlat.value.length > 0)

const progressPct = computed(() => {
  const c = props.plan.completion
  const total = c.newTotal + c.reviewTotal
  if (total === 0) return 0
  return Math.round(((c.newCompleted + c.reviewCompleted) / total) * 100)
})

function reviewContent(r) {
  const item = getItemById(r.itemId)
  return item ? item.content : r.itemId
}
</script>

<style scoped>
.day-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.day-card.day-today {
  border-color: var(--lit);
  box-shadow: 0 0 0 1px rgba(52, 211, 153, 0.3), var(--shadow);
}

.day-card.day-past {
  opacity: 0.82;
}

.dc-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
}

.dc-head:hover {
  background: var(--bg-hover);
}

.dc-date {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 76px;
}

.dc-day {
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}

.day-today .dc-day {
  color: var(--lit);
}

.dc-meta {
  display: flex;
  flex-direction: column;
}

.dc-weekday {
  font-size: 12px;
  color: var(--text-secondary);
}

.dc-month {
  font-size: 11px;
  color: var(--text-muted);
}

.dc-status {
  flex-shrink: 0;
}

.dc-progress {
  flex: 1;
  min-width: 120px;
}

.dc-progress-text {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  white-space: nowrap;
}

.dc-bar {
  height: 5px;
  border-radius: 3px;
  background: var(--bg-hover);
  overflow: hidden;
}

.dc-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--accent), var(--word));
  transition: width 0.3s;
}

.dc-bar-fill.done {
  background: var(--lit);
}

.dc-arrow {
  color: var(--text-muted);
  transition: transform 0.2s;
  font-size: 14px;
}

.dc-arrow.open {
  transform: rotate(180deg);
}

.dc-body {
  padding: 0 18px 18px;
  border-top: 1px solid var(--border);
  padding-top: 14px;
}

.dc-section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.dc-sentence {
  background: rgba(139, 92, 246, 0.08);
  border-left: 3px solid var(--accent);
  padding: 10px 14px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: 14px;
}

.dc-sentence-en {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
}

.dc-sentence-cn {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 3px;
}

.dc-new-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.dc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.dc-item-content {
  color: var(--text);
  font-weight: 500;
}

.dc-item-meaning {
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

.dc-review-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dc-review-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: var(--bg-soft);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.dc-review-content {
  flex: 1;
  color: var(--text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dc-review-status {
  font-size: 12px;
  flex-shrink: 0;
}

.st-completed { color: var(--lit); }
.st-missed { color: var(--missed); }
.st-pending { color: var(--pending); }

.dc-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 12px 0;
}

@media (max-width: 640px) {
  .dc-head {
    flex-wrap: wrap;
    gap: 10px;
  }

  .dc-progress {
    order: 3;
    flex-basis: 100%;
  }
}
</style>
