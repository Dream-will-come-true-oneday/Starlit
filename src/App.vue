<script setup>
import { computed, onMounted } from 'vue'
import { useProgressStore } from './stores/progressStore'

const progress = useProgressStore()

// 顶部导航：今日 / 规划 / 单词 / 短语 / 语法 / 其他 / 复盘 / 练习
const navs = [
  { path: '/', label: '今日' },
  { path: '/plan', label: '规划' },
  { path: '/words', label: '单词' },
  { path: '/phrases', label: '短语' },
  { path: '/grammar', label: '语法' },
  { path: '/extra', label: '其他' },
  { path: '/review', label: '复盘' },
  { path: '/practice', label: '练习' }
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
        <router-link to="/" class="logo">
          <span class="logo-badge">S</span>
          <span>Starlit</span>
        </router-link>
        <nav class="nav">
          <router-link
            v-for="n in navs"
            :key="n.path"
            :to="n.path"
            class="nav-link"
          >
            {{ n.label }}
            <span v-if="n.path === '/review' && hasReviewToday" class="nav-dot"></span>
          </router-link>
        </nav>
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
}
</style>
