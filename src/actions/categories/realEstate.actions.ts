import { apiClient } from '../client';
import { REAL_ESTATE_ENDPOINTS } from '../../api/endpoints';
import { isAbortError } from '../../util/helpers/api.format';
import type { RawItem } from '../../util/types/common.types';
import type { RealEstate } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getRealEstateById(id: string, signal?: AbortSignal): Promise<RealEstate | null> {
  try {
    const { data } = await apiClient.get<RawItem>(REAL_ESTATE_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<RealEstate>(data) : null;
  } catch (err) {
    if (!isAbortError(err)) console.warn(`[getRealEstateById] failed for id ${id}:`, err);
    return null;
  }
}
