import { IllnessTime } from '@/enum'

export const timeOptions = [
  { label: '一周内', value: IllnessTime.week },
  { label: '一月内', value: IllnessTime.month },
  { label: '半年内', value: IllnessTime.halfYear },
  { label: '大于半年', value: IllnessTime.more }
]
export const flagOptions = [
  { label: '就诊过', value: 0 },
  { label: '没就诊过', value: 1 }
]
