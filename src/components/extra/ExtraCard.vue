<template>
  <div class="extra-card">
    <div class="ec-title">{{ item.content }}</div>
    <div class="ec-meaning">{{ item.meaning }}</div>

    <p v-if="item.detail" class="ec-detail">{{ item.detail }}</p>

    <div v-if="item.structure" class="ec-structure">
      <span class="badge badge-grammar">结构</span>
      <code>{{ item.structure }}</code>
    </div>

    <div v-if="item.rule" class="ec-rule">
      <span class="badge badge-grammar">规则</span>
      <span>{{ item.rule }}</span>
    </div>

    <div v-if="item.example" class="ec-example">{{ item.example }}</div>
    <div v-if="item.exampleCn" class="ec-example-cn">{{ item.exampleCn }}</div>

    <div v-if="item.tips && item.tips.length" class="ec-tips">
      <div class="ec-tips-title">学习技巧</div>
      <ul>
        <li v-for="(tip, i) in item.tips" :key="i">{{ tip }}</li>
      </ul>
    </div>

    <RecommendCard v-if="item.recommend" :recommend="item.recommend" />
  </div>
</template>

<script setup>
import RecommendCard from '../common/RecommendCard.vue'

defineProps({
  item: { type: Object, required: true }
})
</script>

<style scoped>
.extra-card {
  background: var(--bg-card);
  border: 1px solid rgba(183, 243, 107, 0.36);
  border-radius: var(--radius);
  padding: 24px;
}

.ec-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--accent);
}

.ec-meaning {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0 12px;
}

.ec-detail {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 12px;
}

.ec-structure,
.ec-rule {
  margin-bottom: 8px;
}

.ec-structure code {
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 13px;
  color: var(--word);
  background: rgba(100, 181, 255, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  margin-left: 6px;
}

.ec-rule span:last-child {
  font-size: 13px;
  color: var(--text);
  margin-left: 6px;
}

.ec-example {
  font-size: 14px;
  color: var(--text);
  margin-top: 10px;
  line-height: 1.6;
}

.ec-example-cn {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.ec-tips {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(183, 243, 107, 0.06);
  border-radius: var(--radius-sm);
}

.ec-tips-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 6px;
}

.ec-tips ul {
  margin: 0;
  padding-left: 18px;
}

.ec-tips li {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}
</style>
