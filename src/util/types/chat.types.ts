export interface ChatUser {
  id: string;
  username: string;
  profileImage?: string | null;
  email?: string;
}

export interface ChatMessage {
  id: number;
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

export interface Chatroom {
  chatId: number;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  updatedAt: string;
  itemTitle: string | null;
  itemImage: string | null;
  itemPrice: number | null;
  itemId?: string | null;
  itemModel?: string | null;
}
