import { createRouter, createWebHistory } from 'vue-router'

//创建路由实例  createRouter
//创建路由模式配置 createWebHistory/createWebHashHistory

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/login.vue')
    }
  ]
})

export default router
