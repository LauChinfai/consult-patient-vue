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

//患者姓名校验
export const patientNameRules: FieldRule[] = [
  { required: true, message: '请输入身份证上的姓名' },
  { pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/, message: '请输入正确的姓名' }
]
//患者身份证校验
export const patientIdCardRules: FieldRule[] = [
  { required: true, message: '请输入身份证号' },
  {
    pattern:
      /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
    message: '请输入正确的身份证号'
  }
]
