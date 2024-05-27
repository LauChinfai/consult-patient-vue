<script setup lang="ts">
import { OrderType } from '@/enum'
import { uploadImg } from '@/services/consult'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref, computed } from 'vue'
import type { Image } from '@/types/consult'
const props = defineProps<{
  disabled: boolean
}>()
const emit = defineEmits<{
  (n: 'sendMsg', text: string): void
  (n: 'sendImg', img: Image): void
}>()
//文字内容
const text = ref('')
const sendMsg = () => {
  emit('sendMsg', text.value)
  text.value = ''
}
//文件上传，通知父组件监听上传文件事件

const sendImg: UploaderAfterRead = async (item) => {
  if (Array.isArray(item)) return
  if (!item.file) return
  const t = showLoadingToast({ message: '正在上传', duration: 0 })
  const res = await uploadImg(item.file)
  t.close()
  emit('sendImg', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="props.disabled"
      v-model="text"
      @keyup.enter="sendMsg"
    ></van-field>
    <van-uploader
      :after-read="sendImg"
      :preview-image="false"
      :disabled="props.disabled"
    >
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
