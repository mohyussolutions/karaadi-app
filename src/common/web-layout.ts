import { Platform } from 'react-native';

export const IS_WEB = Platform.OS === 'web';

export const WEB_MAX_WIDTH = 1200;

export const WEB_CENTER_STYLE = IS_WEB
  ? { maxWidth: WEB_MAX_WIDTH, width: '100%' as const }
  : null;
