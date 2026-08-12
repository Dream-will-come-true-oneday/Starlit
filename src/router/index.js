import { createRouter, createWebHashHistory } from 'vue-router'

// 使用 hash 路由：纯前端应用无需服务端配置即可直接刷新
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '今日学习' }
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('../views/PlanView.vue'),
    meta: { title: '学习规划' }
  },
  {
    path: '/words',
    name: 'words',
    component: () => import('../views/WordModule.vue'),
    meta: { title: '单词' }
  },
  {
    path: '/phrases',
    name: 'phrases',
    component: () => import('../views/PhraseModule.vue'),
    meta: { title: '短语' }
  },
  {
    path: '/grammar',
    name: 'grammar',
    component: () => import('../views/GrammarModule.vue'),
    meta: { title: '语法' }
  },
  {
    path: '/extra',
    name: 'extra',
    component: () => import('../views/ExtraModule.vue'),
    meta: { title: '其他知识' }
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewCenter.vue'),
    meta: { title: '复盘中心' }
  },
  {
    path: '/practice',
    name: 'practice',
    component: () => import('../views/Practice.vue'),
    meta: { title: '对话练习' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Starlit` : 'Starlit'
})

export default router
