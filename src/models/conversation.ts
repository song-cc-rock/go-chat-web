export interface ConversationResponse {
  id: string;
  targetUserID: string;
  nickName: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: number;
  lastSentUser: string,
  unreadCount: number;
}

export interface ConversationMsgResponse {
  id: string;
  sender: string;
  receiver: string;
  type: string;
  content: string;
  time: number;
  avatar: string;
}
