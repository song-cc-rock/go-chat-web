import type { AuthUser } from '@/models/user.ts'
import router from '@/router'
import { createDiscreteApi } from 'naive-ui'

const USER_KEY = "authUser";
const { message } = createDiscreteApi(["message"])

export function setAuthUser(userInfo: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

export function getAuthUser() {
  const userInfo = localStorage.getItem(USER_KEY)
  if (!userInfo) {
    message.error('用户信息已失效，请重新登录！')
    router.push('/login')
  } else {
    return JSON.parse(userInfo)
  }
}

export function clearAuthUser() {
  localStorage.removeItem(USER_KEY)
}

export function getAuthToken() {
  return localStorage.getItem('token')
}
