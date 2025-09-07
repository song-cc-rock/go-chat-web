import { request } from '@/utils/require.ts'
import type { AuthUser } from '@/models/user.ts'
import type { SearchUserItem } from '@/models/user.ts'
import type { FriendApply } from '@/models/friend.ts'

// 获取用户信息
export function getUserProfile(): Promise<AuthUser> {
  return request.get('/user-profile')
}

// 获取未读消息数量
export function getUnreadCount(id: string): Promise<number> {
  return request.get('/unread-count?id=' + id)
}

// 搜索用户
export function searchUsers(keyword: string): Promise<SearchUserItem> {
  return request.get(`/user-search?keyword=${keyword}`)
}

// 发送好友请求
export function sendFriendRequest(friendApply: FriendApply): Promise<boolean> {
  return request.post('/friend/apply', JSON.stringify(friendApply))
}
