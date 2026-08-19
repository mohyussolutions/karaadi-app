import { apiClient } from '../client';
import { SEARCH_HISTORY_ENDPOINTS } from '../../constants';

export async function saveSearchHistory(query: string): Promise<void> {
  if (!query.trim()) return;
  await apiClient.post(SEARCH_HISTORY_ENDPOINTS.LOG, { query }).catch(() => {});
}

export async function deleteSearchHistory(id: string): Promise<void> {
  await apiClient.delete(SEARCH_HISTORY_ENDPOINTS.DELETE(id)).catch(() => {});
}

export async function getSearchHistory(signal?: AbortSignal): Promise<any[]> {
  const { data } = await apiClient.get(SEARCH_HISTORY_ENDPOINTS.LIST, { signal });
  return Array.isArray(data) ? data : data?.searches || [];
}
