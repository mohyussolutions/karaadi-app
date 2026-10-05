import { apiClient } from '../client';
import { categoryListPath } from '../constants/endpoints';
import type { CreateListingResponse, UnknownMap, VehicleListing } from '../../utils/types';

export async function createListing(categoryKey: string, body: UnknownMap, businessId?: string | null) {
  const { data } = await apiClient.post<CreateListingResponse>(categoryListPath(categoryKey), businessId ? { ...body, businessId } : body);
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
