import { apiClient } from '../client';
import { extractList, normalizeItem } from '../../util/helpers';
import {
  CARS_ENDPOINTS, REAL_ESTATE_ENDPOINTS, MOTORCYCLES_ENDPOINTS,
  BOATS_ENDPOINTS, MARKETPLACE_ENDPOINTS, FARM_EQUIPMENT_ENDPOINTS,
  JOBS_ENDPOINTS, FEED_ENDPOINTS,
} from '../../constants';
import type { Car, RealEstate, Motorcycle, Boat, MarketplaceItem, FarmEquipment, ListingBase } from '../../util/types/listing.types';

export async function fetchCars(params?: Record<string, any>, signal?: AbortSignal): Promise<Car[]> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.LIST, { params, signal });
  return extractList<Car>(data);
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchRealEstate(params?: Record<string, any>, signal?: AbortSignal): Promise<RealEstate[]> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.LIST, { params, signal });
  return extractList<RealEstate>(data);
}

export async function fetchRealEstateById(id: string): Promise<RealEstate> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMotorcycles(params?: Record<string, any>, signal?: AbortSignal): Promise<Motorcycle[]> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.LIST, { params, signal });
  return extractList<Motorcycle>(data);
}

export async function fetchMotorcycleById(id: string): Promise<Motorcycle> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchBoats(params?: Record<string, any>, signal?: AbortSignal): Promise<Boat[]> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.LIST, { params, signal });
  return extractList<Boat>(data);
}

export async function fetchBoatById(id: string): Promise<Boat> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMarketplace(params?: Record<string, any>, signal?: AbortSignal): Promise<MarketplaceItem[]> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.LIST, { params, signal });
  return extractList<MarketplaceItem>(data);
}

export async function fetchMarketplaceById(id: string): Promise<MarketplaceItem> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchFarmEquipment(params?: Record<string, any>, signal?: AbortSignal): Promise<FarmEquipment[]> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.LIST, { params, signal });
  return extractList<FarmEquipment>(data);
}

export async function fetchFarmEquipmentById(id: string): Promise<FarmEquipment> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchJobs(params?: Record<string, any>, signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get(JOBS_ENDPOINTS.LIST, { params, signal });
  return extractList<ListingBase>(data);
}

export async function fetchByCategory(categoryKey: string, params?: Record<string, any>, signal?: AbortSignal): Promise<ListingBase[]> {
  switch (categoryKey) {
    case 'Cars':          return fetchCars(params, signal);
    case 'RealEstate':    return fetchRealEstate(params, signal);
    case 'Motorcycles':   return fetchMotorcycles(params, signal);
    case 'Boats':         return fetchBoats(params, signal);
    case 'Marketplace':   return fetchMarketplace(params, signal);
    case 'farmequipment': return fetchFarmEquipment(params, signal);
    case 'Jobs':          return fetchJobs(params, signal);
    default:              return [];
  }
}

export async function fetchFeedGroup(group: 'fast' | 'slow', signal?: AbortSignal): Promise<ListingBase[]> {
  try {
    const { data } = await apiClient.get(FEED_ENDPOINTS.GROUP(group), { signal });
    return extractList<ListingBase>(data);
  } catch {
    if (group !== 'fast') return [];
    const results = await Promise.allSettled([
      fetchCars({ limit: 4 }, signal),
      fetchRealEstate({ limit: 4 }, signal),
      fetchMotorcycles({ limit: 4 }, signal),
      fetchMarketplace({ limit: 4 }, signal),
      fetchBoats({ limit: 2 }, signal),
      fetchFarmEquipment({ limit: 2 }, signal),
    ]);
    return results.flatMap((r) => (r.status === 'fulfilled' ? (r.value as ListingBase[]) : []));
  }
}

export async function fetchFeed(signal?: AbortSignal): Promise<ListingBase[]> {
  return fetchFeedGroup('fast', signal);
}
