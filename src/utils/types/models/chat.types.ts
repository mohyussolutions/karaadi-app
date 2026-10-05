export interface ChatUser {
  id: string;
  username: string;
  profileImage?: string | null;
  email?: string;
}

export interface ChatMessage {
  id: number | string;
  chatId: number;
  senderId: string;
  receiverId?: string;
  content: string;
  imageUrl?: string | null;
  read: boolean;
  timestamp: string;
  createdAt?: string;
  deleted?: boolean;
  edited?: boolean;
  isEdited?: boolean;
  editedAt?: string;
  sender?: ChatUser;
  senderName?: string;
  senderAvatar?: string | null;
  tempId?: string;
}

export interface Chat {
  id: number;
  senderId: string;
  receiverId: string;
  sender: ChatUser;
  receiver: ChatUser;
  messages: ChatMessage[];
  _count?: { messages: number };
  updatedAt: string;
  lastMessageAt?: string;
}

export type GroupedChat = Chat & { allIds: number[]; unreadTotal: number };

export interface WrappedChatMessage {
  chatId?: number;
  message?: ChatMessage;
}

export type IncomingMessage = ChatMessage | WrappedChatMessage;

export interface CreateChatPayload {
  senderId: string;
  receiverId: string;
  itemId: string;
  itemModel: string;
}

export interface SendMessagePayload {
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
}

export interface CreateChatResponse {
  chat: Chat;
  isNew: boolean;
}
