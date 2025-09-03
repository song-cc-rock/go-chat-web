import { request } from '@/utils/require.ts'
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'

export function getConversationList(id: string): Promise<ConversationResponse[]> {
  return request.get('/conversations?id=' + id)
}

// 添加分页参数的历史消息接口
export function getConversationHis(id: string, page: number = 1, pageSize: number = 20): Promise<ConversationMsgResponse[]> {
  return request.get(`/conversation/his?id=${id}&page=${page}&size=${pageSize}`)
}

export function clearConversationUnreadCount(id: string): Promise<Number> {
  return request.get('/conversation/clear?id=' + id)
}
