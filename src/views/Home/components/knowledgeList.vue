<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './knowledgeCard.vue'
import type {
  Knowledge,
  KnowledgeList,
  KnowledgeParams,
  Type
} from '@/types/consult'
import { onMounted } from 'vue'
import { getKnowledge } from '@/services/consult'
import type { KnowledgePage } from '@/types/consult'
const props = defineProps<{
  type: Type
}>()
//数据
const knowledgeData = ref<KnowledgeList>([])
//初始化查询参数
const initKnowledge = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})

//

//加载中？
const loading = ref(false)
//加载完成？
const finished = ref(false)
//加载完成触发函数
const onLoad = async () => {
  const res = await getKnowledge(initKnowledge.value)
  knowledgeData.value.push(...res.data.rows)
  if (initKnowledge.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    initKnowledge.value.current++
  }
  loading.value = false
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
      <knowledge-card :data="knowledgeData"></knowledge-card
    ></van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
