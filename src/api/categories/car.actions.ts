import { apiClient } from '../client';
import { CARS_ENDPOINTS } from '../../constants';

function normItem(item: any) {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id };
}

export async function getCars(params?: Record<string, any>) {
  try {
    const { data } = await apiClient.get(CARS_ENDPOINTS.LIST, { params });
    const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
    return list.map(normItem);
  } catch { return []; }
}

export async function getCarById(id: string) {
  try {
    const { data } = await apiClient.get(CARS_ENDPOINTS.BY_ID(id));
    return data ? normItem(data) : null;
  } catch { return null; }
}

export async function createCar(body: Record<string, any>) {
  try {
    const { data } = await apiClient.post(CARS_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to create car listing' };
  }
}

export async function updateCar(id: string, body: Record<string, any>) {
  try {
    const { data } = await apiClient.put(CARS_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to update car listing' };
  }
}

export async function deleteCar(id: string) {
  try {
    await apiClient.delete(CARS_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
