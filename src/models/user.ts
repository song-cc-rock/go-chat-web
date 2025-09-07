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
  nickName: string;
  avatar: string;
  mail: string;
  phone: string;
}

// 搜索用户
export interface SearchUserItem {
  id: string
  name: string
  avatar: string
  nickName: string
  mail: string
  phone: string
  status: string
}
