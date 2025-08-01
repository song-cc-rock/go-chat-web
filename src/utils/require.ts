import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import router from '@/router'

const { message } = createDiscreteApi(["message"])

export const request = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加标志位用于跟踪401错误是否已处理
let isRefreshing = false;

/**
 * 设置路由变化监听器以重置刷新状态
 * 应在应用初始化后调用此函数
 */
export function setupRouterListener() {
  // 监听路由变化，重置刷新状态
  router.afterEach(() => {
    isRefreshing = false;
  });
}

request.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data

    if (code === 200) {
      return data
    } else {
      message.error(msg)
      return Promise.reject(new Error(msg))
    }
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 只有当没有正在处理的401错误时才执行处理逻辑
      if (!isRefreshing) {
        isRefreshing = true;
        localStorage.removeItem('token')
        message.error('未授权，请重新登录')
        router.push('/login')
      }
      // 返回被拒绝的Promise，保持错误处理一致性
      return Promise.reject(new Error('未授权，请重新登录'))
    }
    message.error(error.response.data.msg || '网络异常')
    return Promise.reject(error)
  }
)

export const rawClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

rawClient.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data

    if (code === 200) {
      return data
    } else {
      message.error(msg)
      return Promise.reject(new Error(msg))
    }
  },
  (error) => {
    message.error(error.response.data.msg || '网络异常')
    return Promise.reject(error)
  }
)

