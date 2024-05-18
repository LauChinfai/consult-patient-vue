import type { FieldRule } from 'vant'

export const formRules = {
  mobile: [
    { required: true, message: '请填写手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机格式' }
  ],
  password: [
    { required: true, message: '请输入正确的密码' },
    {
      pattern: /^\w{8,24}$/,
      message: '请输入8~24个字符'
    }
  ]
}

export const codeRule: FieldRule[] = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位验证码' }
]
