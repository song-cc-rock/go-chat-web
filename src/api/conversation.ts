import { request } from '@/utils/require.ts'
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'

export function getConversationList(id: string): Promise<ConversationResponse[]> {
  return request.get('/conversations?id=' + id)
}

export function getConversationHis(id: string): Promise<ConversationMsgResponse[]> {
  return request.get('/conversation/his?id=' + id)
}

export function clearConversationUnreadCount(id: string): Promise<Number> {
  return request.get('/conversation/clear?id=' + id)
}
