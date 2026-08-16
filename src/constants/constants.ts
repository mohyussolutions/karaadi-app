import { Platform } from 'react-native';

const isWebDev = __DEV__ && Platform.OS === 'web';

export const API_BASE_URL = isWebDev
  ? 'http://localhost:8090'
  : (process.env.EXPO_PUBLIC_API_URL || 'https://api.karaadi.com').replace(/\/$/, '');
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

export const SITE_URL = 'https://karaadi.com';

export const DETAIL_PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

export const DESCRIPTION_TRUNCATE = 300;
