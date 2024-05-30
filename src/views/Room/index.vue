<script setup lang="ts">
import roomStatus from './components/roomStatus.vue'
import roomAction from './components/roomAction.vue'
import roomMessage from './components/roomMessage.vue'
import io, { Socket } from 'socket.io-client'
import { onMounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUser } from '@/stores'
import { useRoute } from 'vue-router'
import { onUnmounted } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import { ref } from 'vue'
import { MsgType, OrderType } from '@/enum'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import { nextTick } from 'vue'
import dayjs from 'dayjs'
import { showToast } from 'vant'
const store = useUser()
const route = useRoute()

//判断是否初始化消息
const initialMsg = ref(true)

//初始化io，建立socket通信
//将socket提取到全局，因为在函数中声明只能在函数内部使用，这里使用到的函数包括两个钩子函数
//声明类型Socket可以获得提示
let socket: Socket

//消息列表
const list = ref<Message[]>([])

//订单详情
const consult = ref<ConsultOrderItem>()
const loadConsult = async () => {
  console.log(route.query.orderId)
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}
onMounted(() => {
  //初始化
  loadConsult()
  //初始化连接    io('...',{auth:{token:'...'},query:{orderId:'...'}})
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  //监听connect事件，当连接成功时调用
  socket.on('connect', () => {
    console.log('连接成功')
  })
  //监听disconnect事件，当连接关闭时调用
  socket.on('disconnect', () => {
    console.log('连接关闭')
  })
  //监听error事件，当报错时调用
  socket.on('error', (e) => {
    console.log('发生错误', e)
  })
  //接收历史聊天记录
  socket.on('chatMsgList', async ({ data }: { data: TimeMessages[] }) => {
    console.log(data)
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: {
          content: item.createTime
        },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    //消息往上追加
    list.value.unshift(...arr)

    //
    loading.value = false
    if (!arr.length) return showToast('没有更多了...')
    //如果是第一次获取消息那么就滚动到最新（最下层）
    if (initialMsg.value) {
      //外部点进来就让消息已读
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      await nextTick()
      window.scrollTo({
        top: document.body.scrollHeight
      })
      initialMsg.value = false
    }
  })

  //监听订单状态变化 重新加载订单详情
  socket.on('statusChange', () => loadConsult())

  //接收聊天消息
  socket.on('receiveChatMsg', async (data) => {
    //聊天时，收一条读一条
    socket.emit('updateMsgStatus', data.id)
    list.value.push(data)
    await nextTick()
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  })
})
onUnmounted(() => {
  //在销毁阶段主动断开通信
  socket.close()
})

//发送消息
const sendMsg = (a: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: a
    }
  })
}
//发送图片
const sendImg = (img: any) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      picture: img
    }
  })
}

//下拉刷新
const loading = ref(false)
const time = ref(dayjs().format('YYY-MM-DD HH:mm:ss'))
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
</script>
<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室"></cp-nav-bar>
    <room-status
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></room-status>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></room-message>
    </van-pull-refresh>
    <roomAction
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-msg="sendMsg"
      @send-img="sendImg"
    ></roomAction>
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
