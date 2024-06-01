import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
import { followOrUnfollow, getPrescriptionPic } from '@/services/consult'
import { showImagePreview } from 'vant'
//关注和取消关注逻辑复用
export const com_follow = (type: FollowType = 'doc') => {
  //封装等待状态
  const loading = ref(false)
  //封装 关注函数
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followOrUnfollow(item.id, type)
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

//查看处方逻辑复用
export const showPre = () => {
  const onShowPre = async (id: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }
  return { onShowPre }
}
