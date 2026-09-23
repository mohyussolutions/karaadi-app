export const CAT_PATHS = {
  marketplace: "/api/marketplace",
  realEstate: "/api/real-estate",
  cars: "/api/cars",
  motorcycles: "/api/motorcycles",
  boats: "/api/boats",
  farmEquipment: "/api/traktor",
  jobs: "/api/jobs",
} as const;

export const VEHICLE_ENDPOINTS: Record<string, string> = {
  cars: CAT_PATHS.cars,
  boats: CAT_PATHS.boats,
  motorcycles: CAT_PATHS.motorcycles,
  "farm-equipment": CAT_PATHS.farmEquipment,
  farmequipment: CAT_PATHS.farmEquipment,
  traktor: CAT_PATHS.farmEquipment,
};

export const FEED_BASE_PATH = '/api/feed';

export const FEED_GROUPS = {
  FAST: 'fast',
  SLOW: 'slow',
} as const;

export type FeedGroup = (typeof FEED_GROUPS)[keyof typeof FEED_GROUPS];

export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_PAGE_SIZE = 100;
export const FEED_MAX_ITEMS = 2000;
