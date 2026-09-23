export const FEED_BASE_PATH = '/api/feed';

export const FEED_GROUPS = {
  FAST: 'fast',
  SLOW: 'slow',
} as const;

export type FeedGroup = (typeof FEED_GROUPS)[keyof typeof FEED_GROUPS];

export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_PAGE_SIZE = 100;
export const FEED_MAX_ITEMS = 2000;
