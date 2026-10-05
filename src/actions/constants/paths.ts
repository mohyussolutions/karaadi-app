import type { StringMap } from '../../utils/types';
export const API_PREFIX = '/api';

export const CAT_PATHS = {
  marketplace: "/api/marketplace",
  realEstate: "/api/real-estate",
  cars: "/api/cars",
  motorcycles: "/api/motorcycles",
  boats: "/api/boats",
  farmEquipment: "/api/traktor",
  jobs: "/api/jobs",
} as const;

const VEHICLE_ENDPOINTS: StringMap = {
  cars: CAT_PATHS.cars,
  boats: CAT_PATHS.boats,
  motorcycles: CAT_PATHS.motorcycles,
  "farm-equipment": CAT_PATHS.farmEquipment,
  farmequipment: CAT_PATHS.farmEquipment,
  traktor: CAT_PATHS.farmEquipment,
};

export const vehicleListPath = (category: string) => VEHICLE_ENDPOINTS[category] ?? `${API_PREFIX}/${category}`;

export const FEED_BASE_PATH = '/api/feed';
