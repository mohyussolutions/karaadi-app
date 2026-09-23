import { apiClient } from '../client';
import { GEO_ENDPOINTS } from '../../api/endpoints';
import type { GeoRegion } from '../../util/types/browse.types';

export async function clientGetAllRegions(): Promise<GeoRegion[]> {
  try {
    const res = await apiClient.get<GeoRegion[]>(GEO_ENDPOINTS.REGIONS);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function clientAddCity(payload: {
  name: string;
  regionId: string;
}): Promise<{ success: boolean; data: Record<string, unknown> }> {
  try {
    const res = await apiClient.post(GEO_ENDPOINTS.CITIES, payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: Record<string, unknown> } };
    return { success: false, data: apiErr?.response?.data ?? {} };
  }
}
