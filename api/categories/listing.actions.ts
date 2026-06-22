import { apiClient } from '../client';
import { CATEGORY_ENDPOINTS } from '../../features/new-ad/constants/config';

export async function createListing(categoryKey: string, body: Record<string, any>, businessId?: string | null) {
  const endpoint = CATEGORY_ENDPOINTS[categoryKey] || '/api/marketplace';
  const { data } = await apiClient.post(endpoint, businessId ? { ...body, businessId } : body);
  const images: string[] | undefined = Array.isArray(data?.images) && data.images.length ? data.images : undefined;
  return {
    id: data?._id || data?.id || data?.listing?._id || '',
    images,
  };
}

export async function getVehicleDetailById(id: string, endpoint: string, signal?: AbortSignal): Promise<any> {
  const { data } = await apiClient.get(`${endpoint}/${id}`, { signal });
  return data;
}
