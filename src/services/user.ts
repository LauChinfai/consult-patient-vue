import type { CodeType, PatientList, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'
import type { Patient } from '@/types/user'

//密码登录
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', { mobile, password })
}

//发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request<User>('/code', 'GET', { mobile, type })
}

//验证码登录

export const loginByCode = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}

//获取个人信息
export const getUserInfo = () => {
  return request<UserInfo>('/patient/myUser')
}

//获取患者信息列表
export const getPatientList = () => {
  return request<PatientList>('/patient/mylist', 'GET')
}

//添加患者
export const addPatient = (patient: Patient) => {
  return request('/patient/add', 'POST', patient)
}

//编辑患者
export const editPatient = (patient: Patient) => {
  return request('/patient/update', 'PUT', patient)
}

//删除患者
export const delPatient = (id: string) => {
  return request(`/patient/del/${id}`, 'DELETE')
}
