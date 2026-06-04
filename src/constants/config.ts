export const PLACEHOLDER = '/placeholder.png';

export const INITIAL_DISPLAY = 50;
export const DISPLAY_INCREMENT = 20;
export const INITIAL_COUNT = 52;
export const INCREMENT = 20;
export const MAX_COUNT = 120;
export const LISTING_PAGE_SIZE = 12;

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
