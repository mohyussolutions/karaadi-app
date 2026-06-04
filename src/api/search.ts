import { apiClient } from './client';
import { extractList } from '../components/normalize';
import { SEARCH_ENDPOINTS, MY_ADS_ENDPOINTS, FEED_ENDPOINTS } from '../constants/endpoints';
import type { SearchResult, ListingBase } from '../utils/types';

export interface SearchParams {
  q?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function globalSearch(params: SearchParams, page = 1): Promise<SearchResult[]> {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.GLOBAL, {
    params: { ...params, page },
  });
  return extractList<SearchResult>(data);
}

export async function getMyAds(): Promise<ListingBase[]> {
  const { data } = await apiClient.get(MY_ADS_ENDPOINTS.LIST);
  return extractList<ListingBase>(data);
}

export async function getFeed(page = 1): Promise<ListingBase[]> {
  const { data } = await apiClient.get(FEED_ENDPOINTS.FEED, { params: { page } });
  return extractList<ListingBase>(data);
}
