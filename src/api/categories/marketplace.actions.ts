import { apiClient } from '../client';
import { MARKETPLACE_ENDPOINTS } from '../../constants';

function normItem(item: any) {
  const id = String(item._id ?? item.id ?? '');
  return { ...item, _id: id, id };
}

export async function getMarketplaceItems(params?: Record<string, any>) {
  try {
    const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.LIST, { params });
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return list.map(normItem);
  } catch { return []; }
}

export async function getMarketplaceItemById(id: string) {
  try {
    const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.BY_ID(id));
    return data ? normItem(data) : null;
  } catch { return null; }
}

export async function createMarketplaceItem(body: Record<string, any>) {
  try {
    const { data } = await apiClient.post(MARKETPLACE_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to create listing' };
  }
}

export async function updateMarketplaceItem(id: string, body: Record<string, any>) {
  try {
    const { data } = await apiClient.put(MARKETPLACE_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to update listing' };
  }
}

export async function deleteMarketplaceItem(id: string) {
  try {
    await apiClient.delete(MARKETPLACE_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false }; }
}
