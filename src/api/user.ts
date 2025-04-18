import { request } from '@/utils/require.ts'
import type { AuthUser } from '@/models/user.ts'

export function getUserProfile(): Promise<AuthUser> {
  return request.get('/user-profile')
}

export function getUnreadCount(id: string): Promise<number> {
  return request.get('/unread-count?id=' + id)
}
