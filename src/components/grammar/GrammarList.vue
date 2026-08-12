<template>
  <div class="grammar-list">
    <div v-for="item in items" :key="item.id" class="grammar-row" @click="$emit('select', item)">
      <div class="gr-main">
        <span class="gr-content">{{ item.content }}</span>
        <span class="gr-meaning">{{ item.meaning }}</span>
      </div>
      <div class="gr-side">
        <span v-if="progressMap[item.id]" class="badge" :class="progressMap[item.id].isMastered ? 'badge-lit' : 'badge-pending'">
          {{ progressMap[item.id].memoryStrength }}%
        </span>
        <span v-else class="gr-unlearned">未学</span>
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
.grammar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grammar-row {
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

.grammar-row:hover {
  border-color: var(--grammar);
  background: var(--bg-hover);
  transform: translateX(2px);
}

.gr-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
  flex-wrap: wrap;
}

.gr-content {
  font-size: 15px;
  font-weight: 600;
  color: #fcd34d;
}

.gr-meaning {
  font-size: 13px;
  color: var(--text-secondary);
}

.gr-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gr-unlearned {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
