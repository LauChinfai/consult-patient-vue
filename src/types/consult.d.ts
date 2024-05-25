//每条CARD的具体返回类型
export type Knowledge = {
  id: string
  title: string //标题
  coverUrl: string //封面
  topics: string[] //标签
  collectionNumber: number //收藏数
  commentNumber: number //评论数
  creatorName: string //医生名
  creatorAvatar: string //医生头像
  creatorHospatalName: string
  /** 关注文章 */
  likeFlag: 0 | 1
  /** 内容 */
  content: string
  /** 医生科室 */
  creatorDep: string
  /** 医生职称 */
  creatorTitles: string
  /** 医生ID */
  creatorId: string
}
//List的返回类型
export type KnowledgeList = Knowledge[]
//返回res的类型
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}
//定义传参type字段类型
export type Type = 'like' | 'recommend' | 'fatReduction' | 'food'
//定义传参类型
export type KnowledgeParams = ParamsPage & {
  type: Type
}
//提取查询参数公共部分
export type ParamsPage = {
  current: number
  pageSize: number
}

//医生列表查询参数
export type DoctorParams = ParamsPage & {}

//医生列表具体信息
export type Doctor = {
  /** 医生ID */
  id: string
  /** 医生名称 */
  name: string
  /** 头像 */
  avatar: string
  /** 医院名称 */
  hospitalName: string
  /** 医院等级 */
  gradeName: string
  /** 科室 */
  depName: string
  /** 职称 */
  positionalTitles: string
  /** 是否关注，0 未关注 1 已关注 */
  likeFlag: 0 | 1
  /** 接诊服务费 */
  serviceFee: number
  /** 接诊人数 */
  consultationNum: number
  /** 评分 */
  score: number
  /** 主攻方向 */
  major: string
}

//医生列表
export type DoctorList = Doctor[]

//医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

//TODO   关注的类型      关注医生/关注文章/关注话题/关注疾病
export type FollowType = 'doc' | 'knowledge' | 'topic' | 'disease'
