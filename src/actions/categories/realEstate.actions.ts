import { apiClient } from '../client';
import { REAL_ESTATE_ENDPOINTS } from '../../api/urls';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { RealEstate } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getRealEstateListings(params?: Params, signal?: AbortSignal): Promise<RealEstate[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[] }>(REAL_ESTATE_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => normItem<RealEstate>(item));
  } catch { return []; }
}

export async function getRealEstateById(id: string, signal?: AbortSignal): Promise<RealEstate | null> {
  try {
    const { data } = await apiClient.get<RawItem>(REAL_ESTATE_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<RealEstate>(data) : null;
  } catch { return null; }
}

export async function createRealEstate(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(REAL_ESTATE_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateRealEstate(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.patch<{ _id?: string; id?: string }>(REAL_ESTATE_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteRealEstate(id: string) {
  try {
    await apiClient.delete(REAL_ESTATE_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
