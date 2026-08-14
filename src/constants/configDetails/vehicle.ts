import { CAT_PATHS } from '../categories';
import type { CategorySpecField, CategoryTypeConfig } from '../../util/types';

export const CARS_ENDPOINTS = {
  LIST: '/api/cars',
  BY_ID: (id: string) => `/api/cars/${id}`,
  CREATE: '/api/cars',
  UPDATE: (id: string) => `/api/cars/${id}`,
  DELETE: (id: string) => `/api/cars/${id}`,
};

export const BOATS_ENDPOINTS = {
  LIST: '/api/boats',
  BY_ID: (id: string) => `/api/boats/${id}`,
  CREATE: '/api/boats',
  UPDATE: (id: string) => `/api/boats/${id}`,
  DELETE: (id: string) => `/api/boats/${id}`,
};

export const MOTORCYCLES_ENDPOINTS = {
  LIST: '/api/motorcycles',
  BY_ID: (id: string) => `/api/motorcycles/${id}`,
  CREATE: '/api/motorcycles',
  UPDATE: (id: string) => `/api/motorcycles/${id}`,
  DELETE: (id: string) => `/api/motorcycles/${id}`,
};

export const FARM_EQUIPMENT_ENDPOINTS = {
  LIST: '/api/traktor',
  BY_ID: (id: string) => `/api/traktor/${id}`,
  CREATE: '/api/traktor',
  UPDATE: (id: string) => `/api/traktor/${id}`,
  DELETE: (id: string) => `/api/traktor/${id}`,
};

const VEHICLE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'brand', labelKey: 'vehicleDetail.make' },
  { key: 'model', labelKey: 'vehicleDetail.model' },
  { key: 'vehicleModel', labelKey: 'vehicleDetail.model' },
  { key: 'modelName', labelKey: 'vehicleDetail.model' },
  { key: 'boatModel', labelKey: 'vehicleDetail.model' },
  { key: 'traktortModel', labelKey: 'vehicleDetail.model' },
  { key: 'year', labelKey: 'vehicleDetail.year' },
  { key: 'mileage', labelKey: 'vehicleDetail.mileage', format: (v) => `${Number(v).toLocaleString()} km` },
  { key: 'hours', labelKey: 'vehicleDetail.hours', format: (v) => `${v} h` },
  { key: 'fuelType', labelKey: 'vehicleDetail.fuelType' },
  { key: 'transmission', labelKey: 'vehicleDetail.transmission' },
  { key: 'color', labelKey: 'vehicleDetail.color' },
  { key: 'type', labelKey: 'vehicleDetail.type' },
  { key: 'length', labelKey: 'vehicleDetail.length', format: (v) => `${v} ft` },
];

export const VEHICLE_CONFIG: Record<string, CategoryTypeConfig> = {
  cars: { label: 'Car Details', endpoint: CAT_PATHS.cars, fields: VEHICLE_SPEC_FIELDS },
  boats: { label: 'Boat Details', endpoint: CAT_PATHS.boats, fields: VEHICLE_SPEC_FIELDS },
  motorcycles: { label: 'Motorcycle Details', endpoint: CAT_PATHS.motorcycles, fields: VEHICLE_SPEC_FIELDS },
  farmequipment: { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
  'farm-equipment': { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
  traktor: { label: 'Equipment Details', endpoint: CAT_PATHS.farmEquipment, fields: VEHICLE_SPEC_FIELDS },
};

export function getVehicleConfig(category: string): CategoryTypeConfig {
  return VEHICLE_CONFIG[category?.toLowerCase()] ?? VEHICLE_CONFIG.cars;
}
