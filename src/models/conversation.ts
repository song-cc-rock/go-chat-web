export interface ConversationResponse {
  id: string;
  targetUserId: string;
  nickName: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: number;
  lastSentUser: string,
  unreadCount: number;
}

export interface ConversationMsgResponse {
  id: string;
  send: string;
  receiver: string;
  content: string;
  created_at: number;
  avatar: string;
  status: string;
  type?: string;
  clientTmpId?: string;
  actualId: string;
}

export interface SendMsgRequest {
  conversation_id: string;
  send: string;
  receiver: string;
  content: string;
  created_at: number;
}