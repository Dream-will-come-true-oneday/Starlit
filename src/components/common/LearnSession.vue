<template>
  <section v-if="sessionActive" class="card learn-session fade-in">
    <div class="ls-progress"><span class="ls-state">LIVE SESSION</span>
      正在学习 {{ index + 1 }} / {{ sessionItems.length }}
      <span class="ls-count">(本组 {{ sessionItems.length }} 项)</span>
    </div>

    <component :is="cardComponent" :item="sessionItems[index]" />

    <div class="ls-actions">
      <button class="btn btn-outline btn-sm" @click="skipHint"><AppIcon name="search" :size="14" /> 查看提示</button>
      <button class="btn btn-primary" @click="markLearned">
        <template v-if="index < sessionItems.length - 1">记住了，下一个 <AppIcon name="arrowRight" :size="14" /></template>
        <template v-else>完成本组学习 <AppIcon name="check" :size="14" /></template>
      </button>
    </div>
    <div class="ls-note">完成本组后自动生成记忆曲线复习计划（Day 1/2/4/7/15/30）</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  /** 卡片组件（动态渲染） */
  cardComponent: { type: Object, required: true },
  /** 是否需要翻转提示 */
  flippable: { type: Boolean, default: false }
})

const emit = defineEmits(['complete'])

const sessionActive = ref(false)
const sessionItems = ref([])
const index = ref(0)

function start(list) {
  if (!list || list.length === 0) return
  sessionItems.value = list
  index.value = 0
  sessionActive.value = true
}

function markLearned() {
  if (index.value < sessionItems.value.length - 1) {
    index.value += 1
  } else {
    const done = sessionItems.value
    sessionActive.value = false
    emit('complete', done)
  }
}

function skipHint() {
  // 翻转卡由卡片自身交互翻转，此处为无操作占位（保持交互一致性）
}

defineExpose({ start })
</script>

<style scoped>
.learn-session {
  margin-bottom: 20px;
}

.ls-progress {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.ls-count {
  color: var(--text-muted);
  font-size: 12px;
}

.ls-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.ls-note {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 10px;
}
</style>
