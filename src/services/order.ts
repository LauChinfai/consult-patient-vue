import type { Logistics, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'
import type { AddressItem } from '@/types/order'
//获取预支付信息
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', params)
//获取查询收获地址列表
export const getAddressList = () =>
  request<AddressItem[]>('/patient/order/address')

//生成药品订单
export const createMedicalOrder = (data: {
  id: string
  addressId: string
  couponId?: string
}) => request<{ id: string }>('patient/medicine/order', 'POST', data)

//获取药品订单详情
export const getMedicalOrderDetail = (id: string) => {
  return request<OrderDetail>(`/patient/medicine/order/detail/${id}`)
}

// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
