<template>
  <div class="extra-list">
    <div v-for="item in items" :key="item.id" class="extra-row" @click="$emit('select', item)">
      <div class="er-main">
        <span class="er-content">{{ item.content }}</span>
        <span class="er-meaning">{{ item.meaning }}</span>
        <span v-if="item.recommend" class="badge badge-lit">荐</span>
      </div>
      <div class="er-side">
        <span v-if="progressMap[item.id]" class="badge" :class="progressMap[item.id].isMastered ? 'badge-lit' : 'badge-pending'">
          {{ progressMap[item.id].memoryStrength }}%
        </span>
        <span v-else class="er-unlearned">未学</span>
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
.extra-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.extra-row {
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

.extra-row:hover {
  border-color: var(--accent);
  background: var(--bg-hover);
  transform: translateX(2px);
}

.er-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;
}

.er-content {
  font-size: 15px;
  font-weight: 600;
  color: #c4b5fd;
}

.er-meaning {
  font-size: 13px;
  color: var(--text-secondary);
}

.er-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.er-unlearned {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
