import type { CategorySpecField, CategoryTypeConfig } from '../../util/types';

export const REAL_ESTATE_ENDPOINTS = {
  LIST: '/api/real-estate',
  BY_ID: (id: string) => `/api/real-estate/${id}`,
  CREATE: '/api/real-estate',
  UPDATE: (id: string) => `/api/real-estate/${id}`,
  DELETE: (id: string) => `/api/real-estate/${id}`,
};

const REAL_ESTATE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'propertyType', labelKey: 'realEstateDetail.propertyTypeLabel' },
  { key: 'category', labelKey: 'realEstateDetail.categoryLabel' },
  { key: 'subcategory', labelKey: 'realEstateDetail.subcategoryLabel' },
  { key: 'bedrooms', labelKey: 'realEstateDetail.bedroomsLabel' },
  { key: 'bathrooms', labelKey: 'realEstateDetail.bathroomsLabel' },
  { key: 'area', labelKey: 'realEstateDetail.sizeSqmLabel', format: (v, t) => `${v} ${t('realEstateDetail.sqm')}` },
  { key: 'floor', labelKey: 'realEstateDetail.floorLabel' },
  { key: 'totalFloors', labelKey: 'realEstateDetail.totalFloorsLabel' },
  {
    key: 'furnished',
    labelKey: 'realEstateDetail.furnished',
    format: (v, t) => (v ? t('vehicleDetail.furnishedYes') : t('vehicleDetail.furnishedNo')),
  },
];

export const REAL_ESTATE_CONFIG: CategoryTypeConfig = {
  label: 'Real Estate Details',
  endpoint: REAL_ESTATE_ENDPOINTS.LIST,
  fields: REAL_ESTATE_SPEC_FIELDS,
};

export function getRealEstateConfig(): CategoryTypeConfig {
  return REAL_ESTATE_CONFIG;
}
