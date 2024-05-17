<script setup lang="ts">
import instance from '@/utils/request'
import { Button } from 'vant'
const send = async () => {
  const res = await instance.request({
    url: '/login/password',
    method: 'post',
    data: {
      password: 'abc12345',
      mobile: '13211112222'
    }
  })
  console.log(res)
}
</script>

<template>
  <div>
    App
    <Button @click="send">发送</Button>
  </div>
</template>
