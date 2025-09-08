import type { FriendRequest } from '@/models/friend'

// Mock好友申请数据
export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'fr001',
    fromUser: {
      id: 'user001',
      name: '张小明',
      avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F594048bb-3a81-4d16-95c0-d0d2f7e78af9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1737874445&t=93b89b7698d017646d56dd8748736e3f',
      email: 'zhangxiaoming@example.com'
    },
    toUser: {
      id: 'currentUser', // 当前用户ID，表示这是别人发给我的申请
      name: '当前用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser',
      email: 'currentuser@example.com'
    },
    message: '你好，我们在技术交流群里认识，希望能加你为好友，一起交流学习！',
    status: 'pending',
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
    type: 'received'
  },
  {
    id: 'fr004',
    fromUser: {
      id: 'currentUser',
      name: '当前用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser',
      email: 'currentuser@example.com'
    },
    toUser: {
      id: 'user004',
      name: '赵小芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user004',
      email: 'zhaoxiaofang@example.com'
    },
    message: '你好，我看到你的技术分享很精彩，希望能交流学习。',
    status: 'approved',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3天前
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前处理
    type: 'sent'
  }
]

// 获取Mock数据的函数
export function getMockFriendRequests(userId: string): Promise<FriendRequest[]> {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      resolve(mockFriendRequests)
    }, 500)
  })
}

// 处理好友申请的Mock函数
export function handleMockFriendRequest(requestId: string, action: 'approve' | 'reject'): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = mockFriendRequests.find(req => req.id === requestId)
      if (request) {
        request.status = action === 'approve' ? 'approved' : 'rejected'
        request.updatedAt = Date.now()
      }
      resolve(true)
    }, 300)
  })
}

// 删除好友申请的Mock函数
export function deleteMockFriendRequest(requestId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockFriendRequests.findIndex(req => req.id === requestId)
      if (index !== -1) {
        mockFriendRequests.splice(index, 1)
      }
      resolve(true)
    }, 200)
  })
}