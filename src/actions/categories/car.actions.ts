import { apiClient } from '../client';
import { CARS_ENDPOINTS } from '../../api/urls';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { Car } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getCars(params?: Params, signal?: AbortSignal): Promise<Car[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[]; items?: RawItem[] }>(CARS_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
    return list.map((item) => normItem<Car>(item));
  } catch { return []; }
}

export async function getCarById(id: string, signal?: AbortSignal): Promise<Car | null> {
  try {
    const { data } = await apiClient.get<RawItem>(CARS_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<Car>(data) : null;
  } catch { return null; }
}

export async function createCar(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(CARS_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create car listing' };
  }
}

export async function updateCar(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.put<{ _id?: string; id?: string }>(CARS_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update car listing' };
  }
}

export async function deleteCar(id: string) {
  try {
    await apiClient.delete(CARS_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
