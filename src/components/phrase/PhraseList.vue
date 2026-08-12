<template>
  <div class="phrase-list">
    <div v-for="item in items" :key="item.id" class="phrase-row" @click="$emit('select', item)">
      <div class="pr-main">
        <span class="pr-content">{{ item.content }}</span>
        <span class="pr-meaning">{{ item.meaning }}</span>
      </div>
      <div class="pr-side">
        <span v-if="progressMap[item.id]" class="badge" :class="progressMap[item.id].isMastered ? 'badge-lit' : 'badge-pending'">
          {{ progressMap[item.id].memoryStrength }}%
        </span>
        <span v-else class="wr-unlearned">未学</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  progressMap: { type: Object, default: () => ({}) }
})

defineEmits(['select'])
</script>

<style scoped>
.phrase-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.phrase-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}

.phrase-row:hover {
  border-color: var(--phrase);
  background: var(--bg-hover);
  transform: translateX(2px);
}

.pr-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
  flex-wrap: wrap;
}

.pr-content {
  font-size: 15px;
  font-weight: 600;
  color: #6ee7b7;
}

.pr-meaning {
  font-size: 13px;
  color: var(--text-secondary);
}

.pr-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wr-unlearned {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
