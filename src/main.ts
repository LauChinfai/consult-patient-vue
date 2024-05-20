import { createApp } from 'vue'

//仓库独立管理
import pinia from '@/stores'

import App from './App.vue'
import router from './router'
//SVG地图
import 'virtual:svg-icons-register'

//导入样式包
import 'vant/lib/index.css'
//引入vant全局样式包要在自定义全局样式包之前，使得自定义样式包可以覆盖vant的全局样式包
import '@/styles/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
