<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './knowledgeCard.vue'
import type { Type } from '@/types/consult'
defineProps<{
  type: Type
}>()

// 模拟请求
const mock = ref<number[]>([])

//

//加载中？
const loading = ref(false)
//加载完成？
const finished = ref(false)
//加载完成触发函数
const onLoad = () => {
  //模拟到底后，延迟1秒请求一次请求
  setTimeout(() => {
    mock.value.push(...[1, 2, 3, 4, 5])
    if (mock.value.length > 20) {
      finished.value = true
    }
    loading.value = false
  }, 1000)
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了..."
      @load="onLoad"
    >
      <knowledge-card v-for="(item, i) in mock" :key="i"></knowledge-card
    ></van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
