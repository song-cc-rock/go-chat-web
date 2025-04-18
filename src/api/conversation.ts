import { request } from '@/utils/require.ts'
import type { ConversationResponse } from '@/models/conversation.ts'

export function getConversationList(id: string): Promise<ConversationResponse[]> {
  return request.get('/conversations?id=' + id)
}
