import type { Animated } from 'react-native';
import type { Lang } from '../app/i18n.types';
import type { MessageBanner } from '../models/notification.types';

export interface LangModalProps {
  visible: boolean;
  insets: { top: number };
  lang: Lang;
  onClose: () => void;
  onSelect: (code: Lang) => void;
}

export interface HeaderLogoProps {
  onPress: () => void;
}

export interface MessageBannerState {
  messageBanner: MessageBanner | null;
  bannerY: Animated.Value;
  showBanner: (data: MessageBanner) => void;
  dismissBanner: () => void;
  handleBannerPress: () => void;
}

export interface RootOverlaysProps {
  banner: MessageBannerState;
}
