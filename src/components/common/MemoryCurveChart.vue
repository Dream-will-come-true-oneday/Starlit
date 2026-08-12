<template>
  <div class="curve-chart">
    <div v-if="!compact" class="curve-legend">
      <span class="legend-item"><i class="dot dot-lit"></i>已打卡（点取消）</span>
      <span class="legend-item"><i class="dot dot-today"></i>今日待办（点打卡）</span>
      <span class="legend-item"><i class="dot dot-unlit"></i>未到期</span>
      <span class="legend-item"><i class="dot dot-missed"></i>已逾期</span>
    </div>

    <svg class="curve-svg" :viewBox="`0 0 ${svgW} 92`" role="img">
      <title>记忆曲线打卡图</title>
      <desc>6 个艾宾浩斯复习节点，点击节点可打卡或取消打卡</desc>

      <!-- 连接线 -->
      <line
        v-for="(node, i) in curve"
        :key="`line-${i}`"
        v-show="i < curve.length - 1"
        :x1="nodeX(i)"
        :y1="40"
        :x2="nodeX(i + 1)"
        :y2="40"
        :stroke="node.isLit ? 'var(--lit)' : '#2c3354'"
        stroke-width="1.5"
        stroke-dasharray="3 3"
      />

      <!-- 节点（整组可点击） -->
      <g
        v-for="(node, i) in curve"
        :key="node.reviewId"
        :class="['curve-node', { clickable: isClickable(node) }]"
        @click="onNodeClick(node)"
      >
        <title>{{ nodeTooltip(node) }}</title>

        <!-- 透明放大命中区，方便点击 -->
        <circle :cx="nodeX(i)" cy="40" r="18" fill="transparent" />

        <!-- 节点圆 -->
        <circle
          :cx="nodeX(i)"
          cy="40"
          :r="10"
          :fill="nodeClass(node).fill"
          :stroke="nodeClass(node).stroke"
          stroke-width="1.5"
        />
        <!-- 点亮对勾 -->
        <path
          v-if="node.isLit"
          :d="`M ${nodeX(i) - 4} 40 L ${nodeX(i) - 1} 43 L ${nodeX(i) + 4} 37`"
          fill="none"
          stroke="#06281c"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- 逾期叉号 -->
        <path
          v-else-if="node.status === 'missed'"
          :d="`M ${nodeX(i) - 3} 37 L ${nodeX(i) + 3} 43 M ${nodeX(i) + 3} 37 L ${nodeX(i) - 3} 43`"
          fill="none"
          stroke="#4a1010"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <!-- 今日待办圆环 -->
        <circle
          v-else-if="node.isToday && node.status === 'pending'"
          :cx="nodeX(i)"
          cy="40"
          r="13"
          fill="none"
          stroke="var(--pending)"
          stroke-width="1.2"
          stroke-dasharray="4 3"
        />

        <text :x="nodeX(i)" y="62" text-anchor="middle" class="node-label">{{ node.label }}</text>
        <text :x="nodeX(i)" y="78" text-anchor="middle" class="node-date">{{ shortDate(node.scheduledDate) }}</text>
      </g>
    </svg>

    <div v-if="progress" class="curve-foot">
      <span class="badge" :class="progress.isMastered ? 'badge-lit' : ''">
        记忆强度 {{ progress.memoryStrength }}%
      </span>
      <span v-if="progress.isMastered" class="badge badge-lit">已掌握</span>
      <span v-else class="badge badge-pending">学习中</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCurveData } from '../../composables/useMemoryCurve.js'

const props = defineProps({
  /** 学习进度对象（含 reviews） */
  progress: { type: Object, default: null },
  /** 或直接传曲线数据数组 */
  curveData: { type: Array, default: null },
  /** 紧凑模式（隐藏图例） */
  compact: { type: Boolean, default: false },
  /** 是否允许点击节点交互（默认 true） */
  interactive: { type: Boolean, default: true }
})

const emit = defineEmits(['check-in', 'un-check-in'])

const curve = computed(() => props.curveData || (props.progress ? getCurveData(props.progress) : []))

const svgW = computed(() => {
  const n = curve.value.length || 6
  return Math.max(n * 52 + 48, 320) // 左右各预留 24px，避免文字被截
})

function nodeX(i) {
  const n = curve.value.length || 6
  const span = svgW.value - 48
  const step = span / Math.max(n - 1, 1)
  return 24 + i * step
}

function nodeClass(node) {
  if (node.isLit) return { fill: 'var(--lit)', stroke: 'var(--lit)' }
  if (node.status === 'missed') return { fill: 'var(--missed)', stroke: 'var(--missed)' }
  if (node.isToday) return { fill: 'var(--pending)', stroke: 'var(--pending)' }
  return { fill: '#232a4a', stroke: '#3a4370' }
}

function shortDate(date) {
  if (!date) return ''
  const d = String(date)
  const parts = d.split('-')
  return parts.length === 3 ? `${parts[1]}/${parts[2]}` : d
}

/** pending 或 completed 都可点（pending → 打卡；completed → 取消） */
function isClickable(node) {
  if (!props.interactive) return false
  return node.status === 'pending' || node.status === 'completed'
}

function nodeTooltip(node) {
  if (node.isLit) return `${node.label}（${shortDate(node.scheduledDate)}）已打卡 — 点击取消`
  if (node.status === 'missed') return `${node.label}（${shortDate(node.scheduledDate)}）已逾期`
  if (node.isToday) return `${node.label}（${shortDate(node.scheduledDate)}）今日 — 点击打卡`
  return `${node.label}（${shortDate(node.scheduledDate)}）未到期`
}

function onNodeClick(node) {
  if (!isClickable(node)) return
  if (node.status === 'pending') emit('check-in', { reviewId: node.reviewId })
  else if (node.status === 'completed') emit('un-check-in', { reviewId: node.reviewId })
}
</script>

<style scoped>
.curve-chart {
  width: 100%;
}

.curve-svg {
  width: 100%;
  height: auto;
  display: block;
}

.curve-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.dot-lit { background: var(--lit); }
.dot-today { background: var(--pending); }
.dot-unlit { background: #232a4a; border: 1px solid #3a4370; }
.dot-missed { background: var(--missed); }

.curve-node.clickable {
  cursor: pointer;
}
.curve-node.clickable:hover circle:nth-of-type(2) {
  filter: brightness(1.2);
  transform: scale(1.15);
  transform-origin: center;
  transform-box: fill-box;
  transition: transform 0.12s, filter 0.12s;
}

.node-label {
  font-size: 11px;
  fill: var(--text-secondary);
}
.node-date {
  font-size: 10px;
  fill: var(--text-muted);
}
.curve-foot {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>