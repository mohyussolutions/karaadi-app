import { apiClient } from '../client';
import { SEARCH_HISTORY_ENDPOINTS } from '../constants/endpoints';
import type { SearchHistoryItem, SearchHistoryResponse } from '../../utils/types';

export async function deleteSearchHistory(id: string): Promise<void> {
  await apiClient.delete(SEARCH_HISTORY_ENDPOINTS.DELETE(id)).catch(() => {});
}

export async function getSearchHistory(signal?: AbortSignal): Promise<SearchHistoryItem[]> {
  const { data } = await apiClient.get<SearchHistoryResponse>(SEARCH_HISTORY_ENDPOINTS.LIST, { signal });
  return Array.isArray(data) ? data : data?.searches || [];
}
