<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUnreadMessageCount } from '@/services/user'
const unreadCount = ref<number>()
onMounted(async () => {
  const res = await getUnreadMessageCount()
  unreadCount.value = res.data
})
</script>
<template>
  <RouterView> </RouterView>
  <van-tabbar route>
    <van-tabbar-item to="/home" icon="home-o">
      首页
      <template #icon="{ active }">
        <CpIcon
          :name="`home-index-${active ? 'active' : 'default'}`"
        ></CpIcon> </template
    ></van-tabbar-item>
    <van-tabbar-item to="/article" icon="search"
      >健康百科
      <template #icon="{ active }">
        <CpIcon
          :name="`home-article-${active ? 'active' : 'default'}`"
        ></CpIcon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/notify" icon="friends-o" :badge="unreadCount"
      >消息中心
      <template #icon="{ active }">
        <CpIcon :name="`home-notice-${active ? 'active' : 'default'}`"></CpIcon>
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/user" icon="setting-o"
      >我的
      <template #icon="{ active }">
        <CpIcon :name="`home-mine-${active ? 'active' : 'default'}`"></CpIcon>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<style scoped lang="scss">
.layout-page {
  :deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }
      &__text {
        font-size: 11px;
      }
      &:not(.van-tabbar-item--active) {
        color: var(--cp-text3);
      }
    }
  }
}
</style>
