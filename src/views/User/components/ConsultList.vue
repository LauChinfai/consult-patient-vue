<script setup lang="ts">
import { ConsultType } from '@/enum'
import ConsultItem from './ConsultItem.vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { getConsultOrderList } from '@/services/consult'
//定义父组件传来的列表类型参数
const props = defineProps<{
  type: ConsultType
}>()
//定义响应式列表存储数据
const list = ref<ConsultOrderItem[]>([])
//加载
const loading = ref(false)
//全部内容是否加载完成
const finished = ref(false)

//列表滑到底执行函数
const load = () => {
  console.log(1)
}

//初始化请求数据
const initParams: ConsultOrderListParams = {
  type: props.type,
  current: 1,
  pageSize: 10
}

//请求数据
onMounted(async () => {
  loading.value = true
  const res = await getConsultOrderList(initParams)
  list.value.push(...res.data.rows)
  if (initParams.current < res.data.pageTotal) {
    initParams.current++
  } else {
    finished.value = true
  }
  loading.value = false
})
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model="list"
      :loading="loading"
      :finished="finished"
      finished-text="没有更多了..."
      @load="load"
    >
      <consult-item v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
