<script setup lang="ts">
import {
  getPatientList,
  addPatient,
  editPatient,
  delPatient
} from '@/services/user'
import type { Patient, PatientList } from '@/types/user'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { patientNameRules, patientIdCardRules } from '@/utils/formRules'
import {
  showConfirmDialog,
  showSuccessToast,
  showToast,
  type FormInstance
} from 'vant'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConsultStore } from '@/stores'
import { nextTick } from 'vue'
import router from '@/router'
const patientList = ref<PatientList>([])
const patientInit = async () => {
  patientList.value = (await getPatientList()).data
  if (route.query.isChange && patientList.value.length) {
    const defaultChoose = patientList.value.find(
      (item) => item.defaultFlag === 1
    )
    if (defaultChoose) selectedId.value = defaultChoose.id
    else selectedId.value = patientList.value[0].id
  }
}

onMounted(() => {
  patientInit()
})

// 单选按钮封装
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const gender = ref(1)

//右侧popup
const showRight = ref(false)
const showRightFn = (item?: Patient) => {
  showRight.value = true
  if (item?.id) {
    console.log(item)
    newPatient.value.id = item.id
    newPatient.value.name = item.name
    newPatient.value.idCard = item.idCard
    newPatient.value.gender = item.gender
    newPatient.value.defaultFlag = item.defaultFlag
  } else {
    newPatient.value = { ...initPatient }
  }
}

//绑定患者
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const newPatient = ref<Patient>({ ...initPatient })
//判断性别
const genderJudge = computed({
  get: () => {
    return newPatient.value.defaultFlag === 1 ? true : false
  },
  set: (value) => {
    newPatient.value.defaultFlag = value ? 1 : 0
  }
})

//表单校验
const form = ref<FormInstance>()
const saveNew = async () => {
  await form.value?.validate()
  const gender = +newPatient.value.idCard.slice(-2, -1) % 2
  if (gender === newPatient.value.gender) {
    showConfirmDialog({
      title: '温馨提示',
      message: '您提交的性别与身份证信息不一致\n您确认提交吗？'
    })
  }
  if (newPatient.value?.id) {
    await showConfirmDialog({
      title: '确认保存编辑吗？',
      message: '确认保存编辑患者信息吗？'
    })
    await editPatient(newPatient.value)
  } else {
    await showConfirmDialog({
      title: '确认保存吗？',
      message: '确认保存为新患者吗'
    })
    await addPatient(newPatient.value)
  }
  showRight.value = false
  newPatient.value = { ...initPatient }
  patientInit()
  showSuccessToast(newPatient.value.id ? '编辑成功' : '保存成功')
}
//删除患者
const del = async () => {
  await showConfirmDialog({
    title: '确认',
    message: `确认要删除 ${newPatient.value.name} 相关信息吗?\n此操作不可恢复`
  })
  await delPatient(newPatient.value?.id!)
  patientInit()
  showRight.value = false
  newPatient.value = { ...initPatient }
  showToast('删除成功')
}

//判断是否是家庭档案还是选择患者
const route = useRoute()
const isChanged = computed(() => {
  return route.query.isChange ? true : false
})
const selectedId = ref('')
const store = useConsultStore()
const choose = (item: Patient) => {
  if (route.query.isChange) {
    selectedId.value = item.id || ''
  }
}
const next = () => {
  if (!selectedId.value) showToast('请选择患者')
  store.setPatient(selectedId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChanged ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <div class="patient-list">
      <!-- 列表部分 -->
      <div
        class="patient-item"
        v-for="item in patientList"
        :key="item.id"
        @click.stop="choose(item)"
        :class="{ selected: selectedId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(.*)(.{4})$/, '$1**********$3')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ `${item.age}` }}岁</span>
        </div>
        <div class="icon" @click="showRightFn(item)">
          <cp-icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag">默认</div>
      </div>
      <!-- 分割 -->
      <div class="patient-add">
        <cp-icon name="user-add" />
        <p @click="showRightFn()">添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>

    <!--  -->
    <!-- 弹框 -->
    <van-popup v-model:show="showRight" position="right"
      ><cp-nav-bar
        right-text="保存"
        :title="newPatient.id ? '编辑患者' : '添加患者'"
        :close="() => (showRight = false)"
        @click-right="saveNew"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field
          label="真实姓名"
          placeholder="请输入真实姓名"
          v-model="newPatient.name"
          :rules="patientNameRules"
        />

        <van-field
          label="身份证号"
          placeholder="请输入身份证号"
          v-model="newPatient.idCard"
          :rules="patientIdCardRules"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              :options="options"
              v-model="newPatient.gender"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox
              :icon-size="18"
              round
              v-model="newPatient.defaultFlag"
            />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="newPatient.id" @click="del">
        <van-action-bar-button type="danger" text="删除" />
      </van-action-bar>
    </van-popup>
    <!--  -->
    <van-button
      class="next"
      block
      round
      type="primary"
      @click="next"
      v-if="route.query.isChange"
      >下一步</van-button
    >
    <!--  -->
  </div>
</template>

<style lang="scss" scoped>
:deep(.next) {
  width: 300px;
  margin: 0 auto;
}
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      padding-top: 46px;
      width: 100%;
      height: 100%;
    }
  }
}

.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.van-action-bar {
  margin: 0 auto;
  width: 230px;
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: white;
    font-size: 14px;
    background-color: var(--cp-bg);
  }
}
</style>
