export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastChatTime: string;
  lastChatContent: string;
}

export interface ContactUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  type: string;
  phone: string;
}

export interface AuthUser {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
}
