import type {
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage,
  ConsultPrepay,
  ConsultPrepayParams,
  DoctorPage,
  DoctorParams,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  PartialConsult,
  TopDep
} from '@/types/consult'
import { request } from '@/utils/request'

//获取文章列表信息
export const getKnowledge = (item: KnowledgeParams) => {
  return request<KnowledgePage>('/patient/home/knowledge', 'GET', item)
}

//获取医生信息
export const getDoctorList = (params: DoctorParams) => {
  return request<DoctorPage>('/home/page/doc', 'GET', params)
}

//TODO 关注/取消关注
export const followOrUnfollow = (id: string, type: FollowType) => {
  return request('/like', 'POST', { id, type })
}

//封装获取部门信息
export const getDepList = () => {
  return request<TopDep>('/dep/all')
}

//上传图片
export const uploadImg = (file: File) => {
  const data = new FormData()
  data.append('file', file)
  return request<Image>('/upload', 'POST', data)
}

//预支付
export const prePay = (item: ConsultPrepayParams) => {
  return request<ConsultPrepay>('/patient/consult/order/pre', 'GET', item)
}

//发送患者信息订单返回订单id
export const createConsultOrder = (patient: PartialConsult) => {
  return request<{ id: string }>('/patient/consult/order', 'POST', patient)
}

//跳转支付页面
export const getPayUrl = (params: {
  paymentMethod: 1 | 0
  orderId: string
  payCallback: string
}) => {
  return request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)
}

//获取订单详情
export const getConsultOrderDetail = (orderId: string) => {
  return request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', {
    orderId
  })
}

//获取处方图片
export const getPrescriptionPic = (id: string) => {
  return request<{ url: string }>(`/patient/consult/prescription/${id}`)
}

//提交评论
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => {
  return request<{ id: string }>('/patient/order/evaluate', 'POST', data)
}

//获取评价列表的数据
export const getConsultOrderList = (params: ConsultOrderListParams) => {
  return request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)
}

//取消订单
export const cancelOrder = (id: string) => {
  return request(`/patient/order/cancel/${id}`, 'POST')
}

//删除订单
export const deleteOrder = (id: string) =>
  request(`/patient/order${id}`, 'DELETE')
