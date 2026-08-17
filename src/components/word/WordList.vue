<template>
  <div class="word-list">
    <div v-for="item in items" :key="item.id" class="word-row" role="button" tabindex="0" :aria-label="`查看 ${item.content} 的记忆曲线`" @click="$emit('select', item)" @keydown.enter.prevent="$emit('select', item)" @keydown.space.prevent="$emit('select', item)">
      <div class="wr-main">
        <span class="wr-word">{{ item.content }}</span>
        <span class="wr-phonetic">{{ item.phonetic }}</span>
      </div>
      <div class="wr-side">
        <span class="wr-meaning">{{ item.meaning }}</span>
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
.word-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.word-row {
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

.word-row:hover {
  border-color: var(--word);
  background: var(--bg-hover);
  transform: translateX(2px);
}

.wr-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.wr-word {
  font-size: 16px;
  font-weight: 600;
  color: var(--word);
}

.wr-phonetic {
  font-size: 12px;
  color: var(--text-muted);
}

.wr-side {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wr-meaning {
  font-size: 14px;
  color: var(--text-secondary);
}

.wr-unlearned {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
