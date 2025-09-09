import { request } from '@/utils/require.ts'
import type { FriendRequest, HandleFriendRequestPayload } from '@/models/friend.ts'

// 获取发起的好友申请列表
export function getApplies(): Promise<FriendRequest[]> {
  return request.get('/applies')
}

// 获取接收的好友申请列表
export function getAccepts(): Promise<FriendRequest[]> {
  return request.get('/accepts')
}

// 处理好友申请（同意或拒绝）
export function handleFriendRequest(payload: HandleFriendRequestPayload): Promise<boolean> {
  return request.post('/handle-request', payload)
}