import type { Animated } from 'react-native';
import type { MessageBanner, Notification } from '../models/notification.types';

export interface NotificationRowProps {
  item: Notification;
  onPress: (item: Notification) => void;
}

export interface NotificationBannerProps {
  banner: MessageBanner;
  translateY: Animated.Value;
  onPress: () => void;
  onDismiss: () => void;
}
