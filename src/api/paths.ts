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

export function getVehicleEndpoint(category: string): string {
  return VEHICLE_ENDPOINTS[category?.toLowerCase()] ?? `/api/${category}`;
}
