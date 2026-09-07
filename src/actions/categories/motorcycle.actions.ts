import { apiClient } from '../client';
import { MOTORCYCLES_ENDPOINTS } from '../../api/endpoints';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { Motorcycle } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getMotorcycles(params?: Params, signal?: AbortSignal): Promise<Motorcycle[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[] }>(MOTORCYCLES_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => normItem<Motorcycle>(item));
  } catch { return []; }
}

export async function getMotorcycleById(id: string, signal?: AbortSignal): Promise<Motorcycle | null> {
  try {
    const { data } = await apiClient.get<RawItem>(MOTORCYCLES_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<Motorcycle>(data) : null;
  } catch { return null; }
}

export async function createMotorcycle(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(MOTORCYCLES_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateMotorcycle(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.put<{ _id?: string; id?: string }>(MOTORCYCLES_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteMotorcycle(id: string) {
  try {
    await apiClient.delete(MOTORCYCLES_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
