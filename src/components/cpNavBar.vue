<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  rightText?: string
  close?: () => void
}>()
const emit = defineEmits<{
  (e: 'rightTextClick'): void
}>()
const clickRight = () => {
  emit('rightTextClick')
}

//拿到router实例，相当于vue2的this.$router
const router = useRouter()
//回退功能,通过historoy.state拿到路由跳转信息，以此判断回退目的地
const clickLeft = () => {
  if (props.close) return props.close()
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/home')
  }
  console.log(history.state)
}
</script>
<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    @click-left="clickLeft"
    :right-text="rightText"
    @click-right="clickRight"
  ></van-nav-bar>
</template>
<style scoped lang="scss">
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
