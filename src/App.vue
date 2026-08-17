<script setup>
import { computed, onMounted } from 'vue'
import { useProgressStore } from './stores/progressStore'
import AppIcon from './components/common/AppIcon.vue'

const progress = useProgressStore()

// 顶部导航：今日 / 规划 / 单词 / 短语 / 语法 / 其他 / 复盘 / 练习
const navs = [
  { path: '/', label: '今日', icon: 'home' },
  { path: '/plan', label: '规划', icon: 'calendar' },
  { path: '/words', label: '单词', icon: 'book' },
  { path: '/phrases', label: '短语', icon: 'chat' },
  { path: '/grammar', label: '语法', icon: 'braces' },
  { path: '/extra', label: '其他', icon: 'sparkles' },
  { path: '/review', label: '复盘', icon: 'refresh' },
  { path: '/practice', label: '练习', icon: 'mic' }
]

// 今日是否有待复习项（红点提示）
const hasReviewToday = computed(() => progress.todayReviewCount > 0)

onMounted(() => {
  // 应用启动时同步一次逾期状态与连续打卡
  progress.syncMissed()
  progress.refreshStreak()
})
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <div class="topbar-inner">
        <router-link to="/" class="logo" aria-label="Starlit 今日学习">
          <span class="logo-badge"><AppIcon name="sparkles" :size="17" /></span>
          <span class="logo-copy">
            <strong>Starlit</strong>
            <small>LEARNING OS</small>
          </span>
        </router-link>
        <nav class="nav" aria-label="主导航">
          <router-link
            v-for="n in navs"
            :key="n.path"
            :to="n.path"
            class="nav-link"
            :aria-label="n.label"
          >
            <AppIcon :name="n.icon" :size="15" />
            <span>{{ n.label }}</span>
            <span v-if="n.path === '/review' && hasReviewToday" class="nav-dot"></span>
          </router-link>
        </nav>
        <div class="system-status" aria-label="系统状态">
          <span class="signal-dot"></span>
          <span>LOCAL / READY</span>
        </div>
      </div>
    </header>

    <main class="layout-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
