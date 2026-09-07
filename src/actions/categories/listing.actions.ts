import { apiClient } from '../client';
import { CATEGORY_ENDPOINTS } from '../../management/create/new-ad/constants/config';
import type { VehicleListing } from '../../util/types/listing.types';

interface CreateListingResponse {
  _id?: string;
  id?: string;
  images?: string[];
  listing?: { _id?: string };
}

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
