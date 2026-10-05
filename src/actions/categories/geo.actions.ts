import { apiClient } from '../client';
import { GEO_ENDPOINTS } from '../constants/endpoints';
import type { AddCityPayload, AddCityResponse, ApiErrorWithData, GeoRegion } from '../../utils/types';

export async function clientGetAllRegions(): Promise<GeoRegion[]> {
  try {
    const res = await apiClient.get<GeoRegion[]>(GEO_ENDPOINTS.REGIONS);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function clientAddCity(payload: AddCityPayload): Promise<AddCityResponse> {
  try {
    const res = await apiClient.post(GEO_ENDPOINTS.CITIES, payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const apiErr = err as ApiErrorWithData;
    return { success: false, data: apiErr?.response?.data ?? {} };
  }
}
