import { apiClient } from '../client';
import { MARKETPLACE_ENDPOINTS } from '../constants/endpoints';
import { isAbortError } from '../../lib/helpers/api/api.format';
import type { MarketplaceItem, RawItem } from '../../utils/types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getMarketplaceItemById(id: string, signal?: AbortSignal): Promise<MarketplaceItem | null> {
  try {
    const { data } = await apiClient.get<RawItem>(MARKETPLACE_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<MarketplaceItem>(data) : null;
  } catch (err) {
    if (!isAbortError(err)) console.warn(`[getMarketplaceItemById] failed for id ${id}:`, err);
    return null;
  }
}
