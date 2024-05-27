import axios, { AxiosError, type Method } from 'axios'
import router from '@/router/index'
import { useUser } from '@/stores'
import { showFailToast, showToast } from 'vant'
import { useRoute } from 'vue-router'
const route = useRoute()
export const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 1000
})

instance.interceptors.request.use(
  (config) => {
    const store = useUser()
    if (config.headers && store.user?.token) {
      config.headers.Authorization = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res) => {
    if (res.data?.code !== 10000) {
      showToast('测试文本' || res.data?.message || `请求失败`)
      Promise.reject(res.data)
    }
    return res.data
  },
  (err: AxiosError) => {
    //定义返回err类型为axiosError可以得到完整提示
    //如果err.response.status === 401
    //清空本地user
    //跳转页面到router,并且携带当前路由地址为参数，以便于登录后返回失效前的操作地址
    if (err.response?.status === 401) {
      const store = useUser()
      store.delUser()
      router.push({
        path: '/login',
        query: { returnURL: router.currentRoute.value.fullPath }
      })
      console.log(route.query.returnURL)
      showFailToast('登录已过期')
    }
    return Promise.reject(err)
  }
)

export default instance

//定义自定义类型Data
type Data<T> = {
  code: string
  message: string
  data: T
}

//定义工具函数
export const request = <T>(
  url: string,
  method?: Method = 'GET',
  sendObj?: Object
) => {
  //自定义数据类型，因为本来axios的request是返回的自带axios类型的res,但是上面修改了返回的是res.data，所以这里的第一个泛型参数必须是any
  return instance.request<any, Data<T>>({
    url,
    method: method.toUpperCase(),
    //动态属性，如果传来的method大写后是get，则为params,如果不是则为data
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: sendObj
  })
}
