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
