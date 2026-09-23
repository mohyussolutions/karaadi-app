import { apiClient } from '../client';
import { CATEGORY_ENDPOINTS } from '../../api/endpoints';
import type { VehicleListing, CreateListingResponse } from '../../util/types/listing.types';

export async function createListing(categoryKey: string, body: Record<string, unknown>, businessId?: string | null) {
  const endpoint = CATEGORY_ENDPOINTS[categoryKey] || '/api/marketplace';
  const { data } = await apiClient.post<CreateListingResponse>(endpoint, businessId ? { ...body, businessId } : body);
  const images: string[] | undefined = Array.isArray(data?.images) && data.images.length ? data.images : undefined;
  return {
    id: data?._id || data?.id || data?.listing?._id || '',
    images,
  };
}

export async function getVehicleDetailById(id: string, endpoint: string, signal?: AbortSignal): Promise<VehicleListing> {
  const { data } = await apiClient.get<VehicleListing>(`${endpoint}/${id}`, { signal });
  return data;
}
