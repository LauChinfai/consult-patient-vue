export type User = {
  token: string
  id: string
  account: string
  mobile: string
  avatar: string
}

//定义验证码类型   login登录register注册 changeMobile修改密码  forgetPassword 找回密码 bindMobile绑定第三方登录
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

//定义个人中心返回值
type OmitUser = Omit<User, 'token'>

export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: string
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}

//获取患者信息
// 家庭档案-患者信息
export type Patient = {
  /** 患者ID */
  id: string
  /** 患者名称 */
  name: string
  /** 身份证号 */
  idCard: string
  /** 0不默认  1默认 */
  defaultFlag: 0 | 1
  /** 0 女  1 男 */
  gender: 0 | 1
  /** 性别文字 */
  genderValue: string
  /** 年龄 */
  age: number
}

// 家庭档案-患者信息列表
export type PatientList = Patient[]
