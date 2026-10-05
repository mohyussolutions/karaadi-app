import type { useRouter } from 'expo-router';

export type NotificationTapRouter = ReturnType<typeof useRouter>;

export interface NotificationData {
  type?: string;
  chatId?: string | number;
  chat_id?: string | number;
  conversationId?: string | number;
  conversation_id?: string | number;
  senderId?: string;
  username?: string;
  listingId?: string;
  category?: string;
  [key: string]: unknown;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data?: NotificationData;
  createdAt: string;
  local?: boolean;
}

export interface ServerNotification {
  id?: string;
  _id?: string;
  userId?: string;
  title?: string;
  message?: string;
  body?: string;
  category?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  itemId?: string | null;
  itemType?: string | null;
  createdAt?: string;
}

export type NotificationFilter = 'all' | 'unread' | 'read';

export interface SocketNotificationPayload {
  id?: string | number;
  title?: string;
  message?: string;
  body?: string;
  category?: string;
  link?: string;
  createdAt?: string;
  userId?: string;
  targetUserId?: string;
  ownerId?: string;
  recipientId?: string;
  notificationId?: string;
  itemId?: string;
  itemType?: string;
  isRead?: boolean;
}

export interface MessageBanner {
  senderName: string;
  content: string;
  chatId?: number;
  senderId?: string;
}

export interface NotificationTriggerLike {
  type?: string;
}

export type NotificationsModule = typeof import('expo-notifications');
export type SocketNotificationMessage = SocketNotificationPayload | SocketNotificationPayload[];
