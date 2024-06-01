import { useUser } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { showFailToast, showToast } from 'vant'
//修改进度条设置
nProgress.configure({
  //关闭转圈
  showSpinner: false
})

//创建路由实例  createRouter
//创建路由模式配置 createWebHistory/createWebHashHistory

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/login.vue'),
      meta: { title: '登录' }
    },
    //家庭档案
    {
      path: '/user/patient',
      component: () => import('@/views/User/Patient.vue'),
      meta: { title: '家庭档案' }
    },
    //极速问诊
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/consultFast.vue'),
      meta: { title: '极速问诊' }
    },
    //病情描述
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/consultIllness.vue'),
      meta: { title: '病情描述' }
    },
    //选择科室
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/consultDep.vue'),
      meta: { title: '选择科室' }
    },
    //支付页面
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/consultPay.vue'),
      meta: { title: '请支付' }
    },
    //问诊室
    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      //钩子函数，在进入路由之前
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    // 问诊记录
    {
      path: '/user/consult',
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: { title: '问诊记录' }
    },
    //订单详情
    {
      path: '/user/consult/:id',
      component: () => import('@/views/User/components/ConsultDetail.vue'),
      meta: { title: '订单详情' }
    },

    {
      path: '/layout',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '主页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '我的' }
        }
      ]
    }
  ]
})

//全局导航守卫
router.beforeEach((to) => {
  //模拟beforeEnter
  // if (to.query.payResult && to.query.payResult === 'false') return '/user/consult55'

  const store = useUser()
  //设置白名单
  const whiteList = ['/login']
  if (!store.user?.token && !whiteList.includes(to.path)) {
    showFailToast('登录超时')
    return '/login'
  }

  //开启进度条
  nProgress.start()
})

//路由后置守卫设置页面标题修改
router.afterEach((to) => {
  document.title = `${to.meta.title}-优医问诊` || ''

  //关闭进度条
  nProgress.done()
})

export default router
