<script setup lang="ts">
import { formRules } from '@/utils/formRules'
import { showToast, type FormInstance } from 'vant'
import { ref } from 'vue'
import { loginByCode, loginByPassword } from '@/services/user'
import { useUser } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { codeRule } from '@/utils/formRules'
import { sendMobileCode } from '@/services/user'
import { onMounted } from 'vue'
const router = useRouter()
const route = useRoute()

//登录模块表单校验
const mobile = ref('')
const password = ref('')
const agree = ref(false)

//表单提交
const formSubmit = async () => {
  if (!agree.value) return showToast('请勾选协议')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  console.log(res)
  //登录成功后将信息存储在本地
  const store = useUser()
  store.setUser(res.data)
  //判断路由是否传参
  router.push((route.query.returnURL as string) || '/user')
  showToast('登陆成功')
}

//短信登录
const isPass = ref(true)
const code = ref('')
const form = ref<FormInstance>()
let timer: number
//发送短信验证码
const time = ref(0)
const onSend = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
  showToast('发送成功')
  time.value = 5
  //开启倒计时
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

//定义密码显示
const passShow = ref(false)

onMounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="login-page">
    <cpNavBar
      rightText="注册"
      @click-right="$router.push('/register')"
    ></cpNavBar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '使用密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="formSubmit" ref="form">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        type="tel"
        v-model="mobile"
        :rules="formRules.mobile"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :type="passShow ? 'text' : 'password'"
        v-model="password"
        :rules="formRules.password"
      >
        <template #button>
          <Cp-Icon
            :name="passShow ? 'login-eye-on' : 'login-eye-off'"
            @click="passShow = !passShow"
            class="cpIcon"
          ></Cp-Icon>
        </template>
      </van-field>
      <!-- 短信登录 -->
      <van-field
        v-else
        placeholder="请输入验证码"
        v-model="code"
        :rules="codeRule"
      >
        <template #button>
          <span
            class="btn-send"
            :class="{ active: time > 0 }"
            @click="onSend"
            >{{ time === 0 ? '发送验证码' : time }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" nativeType="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>

    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep() {
  .cpIcon {
    margin-right: 10px;
  }
}
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
