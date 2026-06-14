import { apiClient } from '../client';
import { extractList } from '../../util/helpers';
import {
  SEARCH_ENDPOINTS,
  CARS_ENDPOINTS, REAL_ESTATE_ENDPOINTS, MOTORCYCLES_ENDPOINTS,
  BOATS_ENDPOINTS, MARKETPLACE_ENDPOINTS, FARM_EQUIPMENT_ENDPOINTS, JOBS_ENDPOINTS,
} from '../../constants';
import type { SearchResult } from '../../util/types';

export interface SearchParams {
  title?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined | null;
}

const CATEGORY_ENDPOINTS: Record<string, string> = {
  Cars: CARS_ENDPOINTS.LIST,
  RealEstate: REAL_ESTATE_ENDPOINTS.LIST,
  Motorcycles: MOTORCYCLES_ENDPOINTS.LIST,
  Boats: BOATS_ENDPOINTS.LIST,
  Marketplace: MARKETPLACE_ENDPOINTS.LIST,
  farmequipment: FARM_EQUIPMENT_ENDPOINTS.LIST,
  Jobs: JOBS_ENDPOINTS.LIST,
};

export async function searchCategory(categoryKey: string, params: SearchParams): Promise<SearchResult[]> {
  try {
    const { data } = await apiClient.get(SEARCH_ENDPOINTS.GLOBAL, {
      params: { ...params, category: categoryKey },
    });
    const results = extractList<SearchResult>(data);
    return results.map((r) => ({ ...r, mainCategory: r.mainCategory || categoryKey }));
  } catch {}

  const endpoint = CATEGORY_ENDPOINTS[categoryKey];
  if (!endpoint) return [];
  const { data } = await apiClient.get(endpoint, { params });
  return extractList<SearchResult>(data).map((r) => ({
    ...r,
    mainCategory: r.mainCategory || categoryKey,
  }));
}

export async function searchAllCategories(params: SearchParams): Promise<SearchResult[]> {
  try {
    const { data } = await apiClient.get(SEARCH_ENDPOINTS.GLOBAL, { params });
    return extractList<SearchResult>(data);
  } catch {}

  const settled = await Promise.allSettled(
    Object.entries(CATEGORY_ENDPOINTS).map(([key, ep]) =>
      apiClient.get(ep, { params }).then(({ data }) =>
        extractList<SearchResult>(data).map((r) => ({
          ...r,
          mainCategory: r.mainCategory || key,
        }))
      )
    )
  );
  return settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
