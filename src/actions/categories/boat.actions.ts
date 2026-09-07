import { apiClient } from '../client';
import { BOATS_ENDPOINTS } from '../../api/endpoints';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { Boat } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getBoats(params?: Params, signal?: AbortSignal): Promise<Boat[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[] }>(BOATS_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => normItem<Boat>(item));
  } catch { return []; }
}

export async function getBoatById(id: string, signal?: AbortSignal): Promise<Boat | null> {
  try {
    const { data } = await apiClient.get<RawItem>(BOATS_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<Boat>(data) : null;
  } catch { return null; }
}

export async function createBoat(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(BOATS_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateBoat(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.put<{ _id?: string; id?: string }>(BOATS_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteBoat(id: string) {
  try {
    await apiClient.delete(BOATS_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
