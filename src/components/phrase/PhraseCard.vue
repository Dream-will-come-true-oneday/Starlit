<template>
  <div class="phrase-card">
    <div class="pc-head">
      <span class="pc-content">{{ item.content }}</span>
      <span class="pc-meaning">{{ item.meaning }}</span>
    </div>
    <div class="pc-example">{{ item.example }}</div>
    <div class="pc-example-cn">{{ item.exampleCn }}</div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.phrase-card {
  background: var(--bg-card);
  border: 1px solid rgba(52, 211, 153, 0.35);
  border-radius: var(--radius);
  padding: 26px 24px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.pc-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.pc-content {
  font-size: 24px;
  font-weight: 600;
  color: #6ee7b7;
}

.pc-meaning {
  font-size: 16px;
  color: var(--text-secondary);
}

.pc-example {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
  margin-top: 6px;
}

.pc-example-cn {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
