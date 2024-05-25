<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { DoctorParams, Doctor } from '@/types/consult'
import { getDoctorList } from '@/services/consult'
//ToDo使用 VueUse库实现组件内适配
//从useWindowSize的实例中解构出width
const { width } = useWindowSize()
//
//
// //原生实现适配
// const width = ref(0) //设置响应式宽度
// const setWidth = () => {
//   width.value = window.innerWidth //将屏幕宽度赋值给width
// }
// onMounted(() => {
//   setWidth() //加载后赋值width
//   window.addEventListener('resize', setWidth) //屏幕改变时重新赋值
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth) //解绑事件，避免性能消耗
// })
// //原生适配
//
//
//

//保存res.data.rows
const doctorList = ref<Doctor[]>([])
//定义初始化查询参数
const initDoctor: DoctorParams = {
  current: 1,
  pageSize: 5
}
//触发渲染函数
const getNew = async () => {
  const res = await getDoctorList(initDoctor)
  doctorList.value = res.data.rows
}
onMounted(() => {
  getNew()
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <van-swipe
        :width="(150 / 375) * width"
        :showIndicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="item in 5" :key="item">
          <doctor-card :doctorList="doctorList"></doctor-card>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
