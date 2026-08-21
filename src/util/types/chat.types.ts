import type { EdgeInsets } from 'react-native-safe-area-context';
import type { RefObject } from 'react';
import type { FlatList } from 'react-native';
import type { ListingRoute } from './common.types';

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
  /** Set on an optimistically-added message before the server confirms it. */
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

export interface HageReplySegment {
  text: string;
  route?: ListingRoute;
}

export interface HageInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading: boolean;
  placeholder: string;
  insets: EdgeInsets;
}

export interface ListingRef {
  id: string;
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
}

export interface HageMessage {
  id: number;
  content: string;
  fromAI: boolean;
  listings?: ListingRef[];
}

export interface HageChatResult {
  reply: string;
  listings: ListingRef[];
}

export interface RawListingRef {
  id?: string;
  _id?: string;
  title: string;
  mainCategory?: string;
  category?: string;
  price?: number;
  images?: string[];
}

export interface HageChatApiResponse {
  reply?: string;
  listings?: RawListingRef[];
}

export interface HageMessageListProps {
  listRef: RefObject<FlatList<HageMessage> | null>;
  messages: HageMessage[];
  loading: boolean;
  insets: EdgeInsets;
  emptyText: string;
  thinkingText: string;
  onListingPress: (listing: ListingRef) => void;
  onLinkPress: (route: ListingRoute) => void;
}
