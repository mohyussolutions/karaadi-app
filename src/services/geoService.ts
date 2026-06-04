import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { API_BASE_URL } from '../constants/endpoints';

const CACHE_KEY = 'karaadi_geo_regions';
const CACHE_TTL = 3_600_000; // 1 hour

const GEO_ENDPOINTS = {
  GET_ALL_REGIONS: `${API_BASE_URL}/api/locations/regions`,
  GET_ALL_CITIES: `${API_BASE_URL}/api/locations/cities`,
  ADD_CITY: `${API_BASE_URL}/api/locations/cities`,
};

async function readCache(): Promise<{ data: any; ts: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function writeCache(data: any): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function clientGetAllRegions(): Promise<any[]> {
  const cached = await readCache();
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const res = await apiClient.get(GEO_ENDPOINTS.GET_ALL_REGIONS);
    const data = res.data;
    await writeCache(data);
    return data;
  } catch {
    return [];
  }
}

export async function clientGetAllCities(regionId?: string): Promise<any[]> {
  if (!regionId) {
    const regions = await clientGetAllRegions();
    return regions.flatMap((r: any) => r.cities ?? []);
  }

  const regions = await clientGetAllRegions();
  const region = regions.find((r: any) => r.id === regionId);
  if (region?.cities) return region.cities;

  try {
    const res = await apiClient.get(
      `${GEO_ENDPOINTS.GET_ALL_CITIES}?regionId=${regionId}`,
    );
    return res.data;
  } catch {
    return [];
  }
}

export async function clientAddCity(data: {
  name: string;
  regionId: string;
}): Promise<{ success: boolean; data: any }> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch {}

  try {
    const res = await apiClient.post(GEO_ENDPOINTS.ADD_CITY, data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, data: err?.response?.data ?? {} };
  }
}
