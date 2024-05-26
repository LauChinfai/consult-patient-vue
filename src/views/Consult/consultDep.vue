<script setup lang="ts">
import { getDepList } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { SubDep, TopDep } from '@/types/consult'
import { ref, onMounted } from 'vue'

const depList = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getDepList()
  depList.value = res.data
  DepTwo.value = depList.value[0].child
  console.log(depList.value)
})

//选择二级科室
const DepTwo = ref<SubDep[]>([])
const chooseDep = (item: SubDep[]) => {
  DepTwo.value = item
}
const active = ref(0)

//点击二级科室获取科室信息
const store = useConsultStore()
</script>

<template>
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          :title="item.name"
          v-for="item in depList"
          :key="item.id"
          @click="chooseDep(item.child)"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="item in DepTwo"
          :key="item.id"
          @click="store.setDep(item.id)"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
