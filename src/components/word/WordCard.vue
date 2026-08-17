<template>
  <div
    class="flip-card"
    :class="{ flipped }"
    role="button"
    tabindex="0"
    :aria-pressed="flipped"
    :aria-label="`${item.content}，翻转查看释义`"
    @click="flip"
    @keydown.enter.prevent="flip"
    @keydown.space.prevent="flip"
  >
    <div class="flip-inner">
      <!-- 正面：英文 -->
      <div class="flip-face flip-front">
        <div class="fc-phonetic">{{ item.phonetic }}</div>
        <div class="fc-word">{{ item.content }}</div>
        <div class="fc-hint">点击卡片查看释义</div>
      </div>

      <!-- 反面：中文 + 例句 -->
      <div class="flip-face flip-back">
        <div class="bc-meaning">{{ item.meaning }}</div>
        <div class="bc-example">{{ item.example }}</div>
        <div class="bc-example-cn">{{ item.exampleCn }}</div>
        <div class="bc-hint">点击卡片翻转回去</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  item: { type: Object, required: true }
})

const flipped = ref(false)

function flip() {
  flipped.value = !flipped.value
}
</script>

<style scoped>
.flip-card {
  perspective: 1000px;
  cursor: pointer;
  width: 100%;
  height: 220px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-inner {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.flip-front {
  background: var(--bg-card);
  border-color: rgba(100, 181, 255, 0.42);
  box-shadow: inset 0 2px 0 rgba(100, 181, 255, 0.32);
}

.flip-back {
  transform: rotateY(180deg);
  background: var(--bg-card);
  border-color: rgba(102, 227, 210, 0.42);
  box-shadow: inset 0 2px 0 rgba(102, 227, 210, 0.32);
}

.fc-phonetic {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.fc-word {
  font-size: 34px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0;
  word-break: break-all;
}

.fc-hint {
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-muted);
}

.bc-meaning {
  font-size: 26px;
  font-weight: 600;
  color: var(--phrase);
  margin-bottom: 14px;
}

.bc-example {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
}

.bc-example-cn {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.bc-hint {
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-muted);
}

.flip-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
</style>
