import { apiClient } from '../client';
import { MARKETPLACE_ENDPOINTS } from '../../api/urls';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { MarketplaceItem } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getMarketplaceItems(params?: Params, signal?: AbortSignal): Promise<MarketplaceItem[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[] }>(MARKETPLACE_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => normItem<MarketplaceItem>(item));
  } catch { return []; }
}

export async function getMarketplaceItemById(id: string, signal?: AbortSignal): Promise<MarketplaceItem | null> {
  try {
    const { data } = await apiClient.get<RawItem>(MARKETPLACE_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<MarketplaceItem>(data) : null;
  } catch { return null; }
}

export async function createMarketplaceItem(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(MARKETPLACE_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateMarketplaceItem(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.put<{ _id?: string; id?: string }>(MARKETPLACE_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteMarketplaceItem(id: string) {
  try {
    await apiClient.delete(MARKETPLACE_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
