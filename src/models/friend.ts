export interface FriendApply {
  fromId: string
  toId: string
  createdAt: number
}

// 好友申请详细信息（用于申请列表显示）
export interface FriendRequest {
  id: string
  fromUser: {
    id: string
    name: string
    avatar: string
    email: string
  }
  toUser: {
    id: string
    name: string
    avatar: string
    email: string
  }
  message?: string // 申请消息
  status: 'pending' | 'approved' | 'rejected' // 申请状态
  createdAt: number // 申请时间
  updatedAt?: number // 处理时间
  type: 'received' | 'sent' // 接收到的申请 或 发送的申请
}

// 处理好友申请的请求
export interface HandleFriendRequestPayload {
  requestId: string
  action: 'approve' | 'reject'
  userId: string // 当前操作用户ID
}