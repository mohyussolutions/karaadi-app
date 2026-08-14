import type { CategorySpecField, CategoryTypeConfig } from '../../util/types';

export const MARKETPLACE_ENDPOINTS = {
  LIST: '/api/marketplace',
  BY_ID: (id: string) => `/api/marketplace/${id}`,
  CREATE: '/api/marketplace',
  UPDATE: (id: string) => `/api/marketplace/${id}`,
  DELETE: (id: string) => `/api/marketplace/${id}`,
};

const MARKETPLACE_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'condition', labelKey: 'vehicleDetail.condition', icon: 'tag-outline' },
  { key: 'subcategory', labelKey: 'vehicleDetail.subcategory', icon: 'shape-outline' },
  { key: 'nestedSubcategory', labelKey: 'vehicleDetail.type', icon: 'dots-horizontal-circle-outline' },
];

export const MARKETPLACE_CONFIG: CategoryTypeConfig = {
  label: 'Marketplace Details',
  endpoint: MARKETPLACE_ENDPOINTS.LIST,
  fields: MARKETPLACE_SPEC_FIELDS,
};

export function getMarketplaceConfig(): CategoryTypeConfig {
  return MARKETPLACE_CONFIG;
}
