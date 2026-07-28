import type { Animated } from 'react-native';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export interface MessageBanner {
  senderName: string;
  content: string;
  chatId?: number;
  senderId?: string;
}

export interface NotificationBannerProps {
  banner: MessageBanner;
  translateY: Animated.Value;
  onPress: () => void;
  onDismiss: () => void;
}
