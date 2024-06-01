import { timeOptions, flagOptions } from '@/services/constants'

//过滤，获取得病时间的文本
export const getIllnessTimeText = (time: number) => {
  return timeOptions.find((item) => item.value === time)?.label
}

//获取是否就诊
export const getConsultFlagText = (flag: number) =>
  flagOptions.find((i) => i.value === flag)?.label
