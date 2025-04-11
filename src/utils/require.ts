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
      localStorage.removeItem('token')
      message.error('未授权，请重新登录')
      router.push('/login')
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

