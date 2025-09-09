export interface FriendApply {
  fromId: string
  toId: string
  createdAt: number
}

export interface FriendRequest {
  id: string
  name: string
  avatar: string
  message?: string
  status: string
  createdAt: number
}

// 处理好友申请的请求
export interface HandleFriendRequestPayload {
  requestId: string
  action: 'approve' | 'reject'
  userId: string // 当前操作用户ID
}