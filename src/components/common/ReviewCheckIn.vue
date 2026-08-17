<template>
  <button
    class="checkin-btn"
    :class="statusClass"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="status === 'completed'"><AppIcon name="check" :size="13" /> 已打卡</span>
    <span v-else-if="status === 'missed'"><AppIcon name="close" :size="13" /> 已逾期</span>
    <span v-else-if="isToday"><span class="status-pip"></span> 今日打卡</span>
    <span v-else>打卡</span>
  </button>
  <button v-if="status === 'completed'" type="button" class="checkin-undo" :disabled="disabled" @click.stop="$emit('un-check-in')">
    取消
  </button>
</template>

<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  status: { type: String, default: 'pending' }, // pending | completed | missed
  scheduledDate: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['check-in', 'un-check-in'])

const isToday = computed(() => props.scheduledDate === todayStr())

const statusClass = computed(() => {
  if (props.status === 'completed') return 'lit'
  if (props.status === 'missed') return 'missed'
  if (isToday.value) return ''
  return ''
})

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function onClick() {
  if (props.disabled) return
  if (props.status === 'pending') emit('check-in')
  // 已点亮的按钮点击不做事（用旁边的"取消"链接，避免误触）
}
</script>

<style scoped>
.checkin-undo {
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  margin-left: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s;
}
.checkin-undo:hover {
  color: var(--missed);
  background: var(--bg-soft);
}

.checkin-btn > span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.checkin-btn:disabled {
  cursor: not-allowed;
}
</style>
