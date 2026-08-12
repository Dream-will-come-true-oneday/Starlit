<template>
  <div v-if="recommend" class="recommend-card">
    <div class="rc-type" :class="typeClass">{{ typeLabel }}</div>
    <div class="rc-body">
      <div class="rc-name">{{ recommend.name }}</div>
      <div class="rc-desc">{{ recommend.desc }}</div>
      <a
        v-if="recommend.link"
        :href="recommend.link"
        target="_blank"
        rel="noopener noreferrer"
        class="rc-link"
        @click.stop
      >
        去学习 ↗
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recommend: { type: Object, default: null }
})

const TYPE_MAP = {
  podcast: { label: '播客', cls: 'rc-podcast' },
  video: { label: '视频', cls: 'rc-video' },
  reading: { label: '阅读', cls: 'rc-reading' },
  channel: { label: '频道', cls: 'rc-channel' }
}

const typeLabel = computed(() => (props.recommend ? (TYPE_MAP[props.recommend.type]?.label || '资源') : ''))
const typeClass = computed(() => (props.recommend ? (TYPE_MAP[props.recommend.type]?.cls || 'rc-reading') : ''))
</script>

<style scoped>
.recommend-card {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: rgba(139, 92, 246, 0.08);
  border: 1px dashed rgba(139, 92, 246, 0.35);
  margin-top: 10px;
}

.rc-type {
  flex-shrink: 0;
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.rc-podcast { background: rgba(52, 211, 153, 0.15); color: #6ee7b7; }
.rc-video { background: rgba(91, 140, 255, 0.15); color: #93b4ff; }
.rc-reading { background: rgba(245, 158, 11, 0.15); color: #fcd34d; }
.rc-channel { background: rgba(236, 72, 153, 0.15); color: #f9a8d4; }

.rc-body {
  flex: 1;
  min-width: 0;
}

.rc-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.rc-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
  line-height: 1.5;
}

.rc-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #c4b5fd;
  font-weight: 500;
}

.rc-link:hover {
  text-decoration: underline;
}
</style>
