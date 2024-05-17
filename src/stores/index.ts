import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(persist)
export default pinia
//导入modules下的所有需要用到的文件
//再导出方便管理
export * from './modules/user'
