<script setup lang="ts">
import roomStatus from './components/roomStatus.vue'
import roomAction from './components/roomAction.vue'
import roomMessage from './components/roomMessage.vue'
</script>
<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室"></cp-nav-bar>
    <room-status></room-status>
    <room-message></room-message>
    <roomAction></roomAction>
  </div>
</template>
<style scoped lang="scss">
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
