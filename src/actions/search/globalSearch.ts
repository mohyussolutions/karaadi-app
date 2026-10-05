import { apiClient } from '../client';
import { extractList } from '../../lib/helpers';
import { SEARCH_ENDPOINTS, CATEGORY_ENDPOINTS } from '../constants/endpoints';
import type { SearchParams, SearchResult, SearchableListing } from '../../utils/types';

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

export async function searchAllListings(query: string, signal?: AbortSignal): Promise<SearchableListing[]> {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.GLOBAL, { params: { q: query }, signal });
  return extractList<SearchableListing>(data).map((item) => ({
    ...item,
    mainCategory: item.itemType || item.mainCategory || '',
  }));
}
