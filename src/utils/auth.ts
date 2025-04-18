import type { AuthUser } from '@/models/user.ts'

const USER_KEY = "authUser";

export function setAuthUser(userInfo: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
}

export function getAuthUser(): AuthUser | null {
  const userInfo = localStorage.getItem(USER_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

export function clearAuthUser() {
  localStorage.removeItem(USER_KEY)
}
