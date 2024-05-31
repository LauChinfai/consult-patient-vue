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
  finished.value = true
}

//初始化请求数据
const initParams = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})

//请求数据
const onLoad = async () => {
  const res = await getConsultOrderList(initParams.value)
  list.value.push(...res.data.rows)
  if (initParams.value.current < res.data.pageTotal) {
    initParams.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
}

const delOrder = (id: string) => {
  list.value.filter((item) => {
    return item.id !== id
  })
  if (!list.value.length) onLoad()
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model="list"
      :loading="loading"
      :finished="finished"
      finished-text="没有更多了..."
      @load="onLoad"
    >
      <consult-item
        v-for="item in list"
        :key="item.id"
        :item="item"
        @delete-order="delOrder"
      />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
