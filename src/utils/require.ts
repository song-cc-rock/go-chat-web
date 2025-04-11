import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(["message"])

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(config => {
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
    message.error(error.response.data.msg || '网络异常')
    return Promise.reject(error)
  }
)

export default request

