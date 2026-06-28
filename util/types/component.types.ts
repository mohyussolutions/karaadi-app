import type { ReactNode } from 'react';
import type { Animated } from 'react-native';
import type { ListingBase } from './listing.types';

export interface ImageGalleryProps {
  images: string[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onImagePress?: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onShare?: () => void;
  badge?: { label: string; color: string } | null;
  isSold?: boolean;
}

export interface ZoomModalProps {
  visible: boolean;
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface DetailCardProps {
  title: string;
  rows: SpecRow[];
  children?: ReactNode;
}

export interface DetailNotFoundProps {
  icon?: string;
  message?: string;
  onBack: () => void;
}

export interface SwipeDownToCloseProps {
  children: ReactNode;
}

export interface DetailActionBarProps {
  onMessage?: () => void;
  messageLabel?: string;
  messageDisabled?: boolean;
  messageIcon?: string;
  onCall?: () => void;
  callLabel?: string;
  priceLabel?: string;
  titleLabel?: string;
  extra?: ReactNode;
}

export interface RecommendedSectionProps {
  endpoint: string;
  excludeId: string;
  title?: string;
  categoryKey?: string;
}

export interface SellerCardProps {
  username?: string | null;
  profileImage?: string | null;
  phone?: string | null;
  subtitle?: string;
  userId?: string | null;
  onMessage?: () => void;
  onCall?: () => void;
  messageBtnLabel?: string;
  messageBtnIcon?: string;
  disabled?: boolean;
}

export interface ListingCardProps {
  item: ListingBase;
  onPress?: () => void;
  categoryKey?: string;
}

export interface MyAdCardProps {
  item: ListingBase;
  deleting?: boolean;
  onDelete: (item: ListingBase) => void;
  onPayNow: (item: ListingBase) => void;
}

export interface SocialShareSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export interface SocialAction {
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  onPress: (message: string) => Promise<void>;
}

export interface SocialPostCardProps {
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  listingUrl: string;
  isPremium90?: boolean;
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

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export interface SplashScreenProps {
  onFinish: () => void;
}

export interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  sidebarStyle?: object;
  mainStyle?: object;
}

export interface PaymentStatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: string;
}

export interface PaymentCategoryInfo {
  label: string;
  icon: string;
  color: string;
}
