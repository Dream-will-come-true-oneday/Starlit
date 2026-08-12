<template>
  <span class="badge" :class="`badge-lv lv-${level}`">
    L{{ level }} · {{ levelName }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: { type: Number, required: true }
})

const LEVEL_NAMES = { 1: '日常', 2: '社交', 3: '职场', 4: '经济', 5: 'IT' }

const levelName = computed(() => LEVEL_NAMES[props.level] || `L${props.level}`)
</script>

<style scoped>
.lv-1 { background: rgba(52, 211, 153, 0.14); color: #6ee7b7; }
.lv-2 { background: rgba(91, 140, 255, 0.14); color: #93b4ff; }
.lv-3 { background: rgba(245, 158, 11, 0.14); color: #fcd34d; }
.lv-4 { background: rgba(216, 90, 48, 0.14); color: #f0997b; }
.lv-5 { background: rgba(139, 92, 246, 0.16); color: #c4b5fd; }
</style>
