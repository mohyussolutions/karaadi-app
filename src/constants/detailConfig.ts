import { CAT_PATHS } from './categories';

export const DETAIL_PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

export const DESCRIPTION_TRUNCATE = 300;

export const VEHICLE_ENDPOINTS: Record<string, string> = {
  cars: CAT_PATHS.cars,
  boats: CAT_PATHS.boats,
  motorcycles: CAT_PATHS.motorcycles,
  'farm-equipment': CAT_PATHS.farmEquipment,
  farmequipment: CAT_PATHS.farmEquipment,
  traktor: CAT_PATHS.farmEquipment,
};

export function getVehicleEndpoint(category: string): string {
  return VEHICLE_ENDPOINTS[category?.toLowerCase()] ?? `/api/${category}`;
}

export const CONDITION_COLORS: Record<string, string> = {
  new: '#16A34A',
  used: '#D97706',
  refurbished: '#2563EB',
};

export function getConditionColor(condition?: string): string | null {
  if (!condition) return null;
  return CONDITION_COLORS[condition.toLowerCase()] ?? null;
}

export const ITEM_MODEL_MAP: Record<string, string> = {
  cars: 'Car',
  boats: 'Boat',
  motorcycles: 'Motorcycle',
  farmequipment: 'Traktor',
  'farm-equipment': 'Traktor',
  traktor: 'Traktor',
  realestate: 'RealEstate',
  'real-estate': 'RealEstate',
  jobs: 'Job',
  job: 'Job',
  marketplace: 'Marketplace',
  subscription: 'Subscription',
};

export function getItemModel(category?: string): string {
  return ITEM_MODEL_MAP[category?.toLowerCase() ?? ''] ?? 'Marketplace';
}
