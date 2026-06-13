import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';

interface GeoRegion {
  id?: string;
  _id?: string;
  name: string;
  cities?: GeoCity[];
}

interface GeoCity {
  id?: string;
  _id?: string;
  name: string;
  region?: string;
}

interface CacheEntry<T> {
  data: T;
  ts: number;
}

const CACHE_KEY = 'karaadi_geo_regions';
const CACHE_TTL = 3_600_000;

const GEO_ENDPOINTS = {
  GET_ALL_REGIONS: '/api/locations/regions',
  GET_ALL_CITIES: '/api/locations/cities',
  ADD_CITY: '/api/locations/cities',
};

async function readCache<T>(): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
}

async function writeCache<T>(data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function clientGetAllRegions(): Promise<GeoRegion[]> {
  const cached = await readCache<GeoRegion[]>();
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const res = await apiClient.get<GeoRegion[]>(GEO_ENDPOINTS.GET_ALL_REGIONS);
    const data = res.data ?? [];
    await writeCache(data);
    return data;
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
      `${GEO_ENDPOINTS.GET_ALL_CITIES}?regionId=${regionId}`,
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
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch {}

  try {
    const res = await apiClient.post(GEO_ENDPOINTS.ADD_CITY, payload);
    return { success: true, data: res.data };
  } catch (err: unknown) {
    const apiErr = err as { response?: { data?: Record<string, unknown> } };
    return { success: false, data: apiErr?.response?.data ?? {} };
  }
}
