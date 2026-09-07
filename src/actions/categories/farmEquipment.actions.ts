import { apiClient } from '../client';
import { FARM_EQUIPMENT_ENDPOINTS } from '../../api/endpoints';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { FarmEquipment } from '../../util/types/listing.types';

function normItem<T>(item: RawItem): T {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id } as T;
}

export async function getFarmEquipment(params?: Params, signal?: AbortSignal): Promise<FarmEquipment[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { data?: RawItem[] }>(FARM_EQUIPMENT_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map((item) => normItem<FarmEquipment>(item));
  } catch { return []; }
}

export async function getFarmEquipmentById(id: string, signal?: AbortSignal): Promise<FarmEquipment | null> {
  try {
    const { data } = await apiClient.get<RawItem>(FARM_EQUIPMENT_ENDPOINTS.BY_ID(id), { signal });
    return data ? normItem<FarmEquipment>(data) : null;
  } catch { return null; }
}

export async function createFarmEquipment(body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(FARM_EQUIPMENT_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateFarmEquipment(id: string, body: Record<string, unknown>) {
  try {
    const { data } = await apiClient.patch<{ _id?: string; id?: string }>(FARM_EQUIPMENT_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteFarmEquipment(id: string) {
  try {
    await apiClient.delete(FARM_EQUIPMENT_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
