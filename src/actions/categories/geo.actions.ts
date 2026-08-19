import { apiClient } from '../client';
import { GEO_ENDPOINTS } from '../../constants';
import type { GeoRegion, GeoCity } from '../../util/types/geo.types';

export async function clientGetAllRegions(): Promise<GeoRegion[]> {
  try {
    const res = await apiClient.get<GeoRegion[]>(GEO_ENDPOINTS.REGIONS);
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function clientGetAllCities(regionId?: string): Promise<GeoCity[]> {
  if (!regionId) {
    const regions = await clientGetAllRegions();
    return regions.flatMap((r) => r.cities ?? []);
  }

  const regions = await clientGetAllRegions();
  const region = regions.find((r) => r.id === regionId);
  if (region?.cities) return region.cities;

  try {
    const res = await apiClient.get<GeoCity[]>(
      `${GEO_ENDPOINTS.CITIES}?regionId=${regionId}`,
    );
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
