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
