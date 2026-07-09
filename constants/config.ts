import { Platform } from 'react-native';

const isWebDev = __DEV__ && Platform.OS === 'web';

export const API_BASE_URL = isWebDev
  ? 'http://localhost:8090'
  : (process.env.EXPO_PUBLIC_API_URL || 'https://karaadi.onrender.com').replace(/\/$/, '');
export const PLACEHOLDER_IMAGE = 'https://placehold.co/300x200/e5e7eb/9ca3af?text=No+Image';

export const PLACEHOLDER = '/placeholder.png';

export const INITIAL_DISPLAY = 50;
export const DISPLAY_INCREMENT = 20;
export const INITIAL_COUNT = 52;
export const INCREMENT = 20;
export const MAX_COUNT = 120;
export const LISTING_PAGE_SIZE = 12;
export const CATEGORY_FEED_LIMIT = 200;

export const BADGE_MAX_COUNT = 9;
export const BADGE_MAX_LABEL = '9+';

export const PRIORITY_CONFIG = {
  PREMIUM:  { label: 'PREMIUM' },
  STANDARD: { label: 'STANDARD' },
  BASIC:    { label: 'BASIC' },
} as const;

export const GRID_CONFIG = {
  PAGE_SIZE:      20,
  INITIAL_PAGE:   1,
  INITIAL_LOAD:   60,
  ITEMS_PER_LOAD: 10,
  MAX_ITEMS:      120,
  MAX_LOADS:      3,
} as const;

export const OPTION = {
  Public:  'Public',
  Private: 'Private',
} as const;
