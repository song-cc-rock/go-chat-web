import { request } from '@/utils/require.ts'
import type { AuthUser } from '@/models/user.ts'

export function getUserProfile(): Promise<AuthUser> {
  return request.get('/user-profile')
}

export function getUnreadCount(id: string): Promise<number> {
  return request.get('/unread-count?id=' + id)
}

// 搜索用户
export interface SearchUserItem {
  id: string
  name: string
  avatar: string
  email: string
}

export function searchUsers(keyword: string): Promise<SearchUserItem[]> {
  return request.get(`/users/search?keyword=${keyword}`)
}

// 发送好友请求
export function sendFriendRequest(userId: string): Promise<{success: boolean, message: string}> {
  return request.post('/friend-requests', { targetId: userId })
}
