<script setup></script>
<template>
  <van-nav-bar fixed left-arrow title="登录" right-text="注册"></van-nav-bar>
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
