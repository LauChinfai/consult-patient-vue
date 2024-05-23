import CpNavBar from '@/components/cpNavBar.vue'
import CpIcon from '@/components/Cp-Icon.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
//固定写法，意为给Vue添加全局样式
declare module 'vue' {
  interface GlobalComponents {
    //前者cpNavBar为组件使用的组件名，后者为导入的组件，typeof在ts中可以用于拓展该字段后数据的类型
    cpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}
