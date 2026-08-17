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
.lv-1 { background: rgba(102, 227, 210, 0.12); color: var(--phrase); }
.lv-2 { background: rgba(100, 181, 255, 0.12); color: var(--word); }
.lv-3 { background: rgba(243, 181, 98, 0.12); color: var(--grammar); }
.lv-4 { background: rgba(255, 130, 120, 0.12); color: var(--missed); }
.lv-5 { background: rgba(183, 243, 107, 0.12); color: var(--accent); }
</style>
