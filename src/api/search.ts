import { apiClient, extractList } from './client';
import { SEARCH_ENDPOINTS, MY_ADS_ENDPOINTS, FEED_ENDPOINTS } from './urls';
import type { SearchResult, ListingBase } from '../types';

export async function globalSearch(query: string, page = 1): Promise<SearchResult[]> {
  const { data } = await apiClient.get(SEARCH_ENDPOINTS.GLOBAL, {
    params: { q: query, page },
  });
  return extractList<SearchResult>(data);
}

export async function semanticSearch(query: string): Promise<SearchResult[]> {
  const { data } = await apiClient.post(SEARCH_ENDPOINTS.SEMANTIC, { query });
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

export async function getRecommendations(): Promise<ListingBase[]> {
  const { data } = await apiClient.get(FEED_ENDPOINTS.RECOMMENDATIONS);
  return extractList<ListingBase>(data);
}
