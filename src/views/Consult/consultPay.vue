<script setup lang="ts">
import router from '@/router'
import { prePay, createConsultOrder, getPayUrl } from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type {
  ConsultPrepay,
  ConsultPrepayParams,
  PartialConsult
} from '@/types/consult'
import type { Patient } from '@/types/user'
import { loadingProps, showConfirmDialog, showDialog, showToast } from 'vant'
import { ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

//预支付信息
const orderPay = ref<ConsultPrepay>()
//患者详情
const patientDetail = ref<Patient>()
//获取预支付数据请求
const store = useConsultStore()
const loadPrepay = async () => {
  const res = await prePay({
    type: store.consult.type!,
    illnessType: store.consult.illnessType!
  })
  orderPay.value = res.data
}
//获取患者详情信息
const loadPatient = async () => {
  console.log(1)
  if (!store.consult.patientId) return
  console.log(2)
  const res = await getPatientDetail(store.consult.patientId)
  console.log(res.data)
  patientDetail.value = res.data
}

//在页面打开时，判断信息是否完整，如果不完整说明是取消支付后的页面，就需要返回home重新填写内容
//校验字段判断
type Keys = keyof PartialConsult
//校验字段
const validKeys: Keys[] = [
  'type',
  'illnessType',
  'depId',
  'illnessDesc',
  'illnessTime',
  'consultFlag',
  'patientId'
]

onMounted(() => {
  //如果遍历consult，有校验字段的内容存在Undefined，那么执行弹框跳转router
  if (validKeys.every((i) => store.consult[i] !== undefined) === false) {
    return showDialog({
      title: '温馨提示',
      message: '患者信息出错，如果您已支付，请前往历史订单查看',
      closeOnPopstate: false
    }).then(() => {
      router.push('/home')
    })
  }
  loadPrepay()
  loadPatient()
})

//同意支付
const agree = ref(false)
//绑定支付页面是否展示
const show = ref(false)
//支付订单ID
const payId = ref('')
//等待支付效果
const loading = ref(false)
//确认按钮跳转支付
const sureToPay = async () => {
  if (!agree.value) return
  //loading效果开
  loading.value = true
  //发送患者信息获取订单ID保存在本地
  const res = await createConsultOrder(store.consult)
  payId.value = res.data.id
  //loading效果关
  loading.value = false
  show.value = true
  //生成订单后清空本地患者信息,是否在这执行存疑
  store.clear()
}
//选择支付方式
const checked = ref<0 | 1>()

//用户引导
//1、如果用户生成了订单，阻止用户使用历史回退功能
onBeforeRouteLeave(() => {
  if (payId.value) return false
})
//2、如果用户在生成订单支付页面点击关闭，那么询问是否关闭，是的话跳转，否的话继续
const beforeClose = () => {
  return showConfirmDialog({
    title: '是否要关闭订单呢',
    message: '现在就诊的人很多，医生时间紧张',
    cancelButtonText: '现在就诊',
    confirmButtonText: '确认取消',
    confirmButtonColor: 'red'
  })
    .then(() => {
      payId.value = ''
      router.push('/user.consult')
      return true
    })
    .catch(() => {
      return false
    })
}

//支付
const toPay = () => {
  if (checked.value === undefined) return showToast('请选择支付方式')
  showConfirmDialog({
    title: '确认支付',
    message: '您是否确认支付?'
  }).then(async () => {
    const res = await getPayUrl({
      orderId: payId.value,
      paymentMethod: checked.value!,
      payCallback: 'http://localhost:5173/room'
    })
    window.location.href = res.data.payUrl
  })
}
</script>

<template>
  <div class="consult-pay-page" v-if="!patientDetail && !orderPay">
    <cp-nav-bar title="支付"> </cp-nav-bar>
    <van-skeleton title :row="5" style="margin-top: 50px" />
  </div>
  <div class="consult-pay-page" v-else>
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ orderPay?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${orderPay?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${orderPay?.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${orderPay?.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patientDetail?.name} | ${patientDetail?.gender ? '男' : '女'} | ${patientDetail?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="orderPay?.actualPayment! * 100"
      button-text="立即支付"
      text-align="left"
      @click="sureToPay"
      :loading="loading"
    />
    <van-action-sheet
      v-model:show="show"
      title="请选择支付方式"
      :close-on-popstate="false"
      :closeable="false"
      :before-close="beforeClose"
    >
      <div class="pay-type">
        <van-cell-group>
          <van-cell title="微信支付" @click="checked = 0"
            ><template #icon><cp-icon name="consult-wechat"></cp-icon></template
            ><template #extra
              ><van-checkbox
                :checked="checked === 0"
                @click="checked = 0" /></template
          ></van-cell>
          <van-cell title="支付宝支付" @click="checked = 1"
            ><template #icon><cp-icon name="consult-alipay"></cp-icon></template
            ><template #extra
              ><van-checkbox
                :checked="checked === 1"
                @click="checked = 1" /></template
          ></van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="toPay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
