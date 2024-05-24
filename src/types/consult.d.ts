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
export type KnowledgeParams = {
  type: Type
  current: number
  pageSize: string
}
