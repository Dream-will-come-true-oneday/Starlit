<template>
  <div class="grammar-card">
    <div class="gc-title">{{ item.content }}</div>
    <div class="gc-meaning">{{ item.meaning }}</div>
    <div class="gc-structure">
      <span class="gc-label">结构</span>
      <code>{{ item.structure }}</code>
    </div>
    <div class="gc-rule">
      <span class="gc-label">规则</span>
      <p>{{ item.rule }}</p>
    </div>
    <div class="gc-example">{{ item.example }}</div>
    <div class="gc-example-cn">{{ item.exampleCn }}</div>
  </div>
</template>

<script setup>
defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.grammar-card {
  background: var(--bg-card);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: var(--radius);
  padding: 24px;
  min-height: 200px;
}

.gc-title {
  font-size: 22px;
  font-weight: 600;
  color: #fcd34d;
}

.gc-meaning {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 14px;
}

.gc-structure,
.gc-rule {
  margin-bottom: 10px;
}

.gc-label {
  display: inline-block;
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 8px;
  vertical-align: middle;
}

code {
  font-family: 'SF Mono', Consolas, 'Courier New', monospace;
  font-size: 13px;
  color: #93b4ff;
  background: rgba(91, 140, 255, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
}

.gc-rule p {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
  margin-top: 4px;
}

.gc-example {
  font-size: 14px;
  color: var(--text);
  margin-top: 12px;
  line-height: 1.6;
}

.gc-example-cn {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
</style>
