import { apiClient } from '../client';
import { REAL_ESTATE_ENDPOINTS } from '../../constants';

function normItem(item: any) {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id };
}

export async function getRealEstateListings(params?: Record<string, any>) {
  try {
    const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.LIST, { params });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map(normItem);
  } catch { return []; }
}

export async function getRealEstateById(id: string) {
  try {
    const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.BY_ID(id));
    return data ? normItem(data) : null;
  } catch { return null; }
}

export async function createRealEstate(body: Record<string, any>) {
  try {
    const { data } = await apiClient.post(REAL_ESTATE_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateRealEstate(id: string, body: Record<string, any>) {
  try {
    const { data } = await apiClient.patch(REAL_ESTATE_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteRealEstate(id: string) {
  try {
    await apiClient.delete(REAL_ESTATE_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
