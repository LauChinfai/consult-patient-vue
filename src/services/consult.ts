import type {
  DoctorPage,
  DoctorParams,
  FollowType,
  KnowledgePage,
  KnowledgeParams,
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
