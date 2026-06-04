import { apiClient } from './client';
import { extractList, normalizeItem } from '../components/normalize';
import {
  CARS_ENDPOINTS, REAL_ESTATE_ENDPOINTS, MOTORCYCLES_ENDPOINTS,
  BOATS_ENDPOINTS, MARKETPLACE_ENDPOINTS, FARM_EQUIPMENT_ENDPOINTS,
  JOBS_ENDPOINTS, FEED_ENDPOINTS,
} from '../constants/endpoints';
import type { Car, RealEstate, Motorcycle, Boat, MarketplaceItem, FarmEquipment, ListingBase } from '../utils/types/listing.types';

export async function fetchCars(params?: Record<string, any>): Promise<Car[]> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.LIST, { params });
  return extractList<Car>(data);
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchRealEstate(params?: Record<string, any>): Promise<RealEstate[]> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.LIST, { params });
  return extractList<RealEstate>(data);
}

export async function fetchRealEstateById(id: string): Promise<RealEstate> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMotorcycles(params?: Record<string, any>): Promise<Motorcycle[]> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.LIST, { params });
  return extractList<Motorcycle>(data);
}

export async function fetchMotorcycleById(id: string): Promise<Motorcycle> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchBoats(params?: Record<string, any>): Promise<Boat[]> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.LIST, { params });
  return extractList<Boat>(data);
}

export async function fetchBoatById(id: string): Promise<Boat> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMarketplace(params?: Record<string, any>): Promise<MarketplaceItem[]> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.LIST, { params });
  return extractList<MarketplaceItem>(data);
}

export async function fetchMarketplaceById(id: string): Promise<MarketplaceItem> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchFarmEquipment(params?: Record<string, any>): Promise<FarmEquipment[]> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.LIST, { params });
  return extractList<FarmEquipment>(data);
}

export async function fetchFarmEquipmentById(id: string): Promise<FarmEquipment> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchJobs(params?: Record<string, any>): Promise<ListingBase[]> {
  const { data } = await apiClient.get(JOBS_ENDPOINTS.LIST, { params });
  return extractList<ListingBase>(data);
}

export async function fetchByCategory(categoryKey: string, params?: Record<string, any>): Promise<ListingBase[]> {
  switch (categoryKey) {
    case 'Cars':          return fetchCars(params);
    case 'RealEstate':    return fetchRealEstate(params);
    case 'Motorcycles':   return fetchMotorcycles(params);
    case 'Boats':         return fetchBoats(params);
    case 'Marketplace':   return fetchMarketplace(params);
    case 'farmequipment': return fetchFarmEquipment(params);
    case 'Jobs':          return fetchJobs(params);
    default:              return [];
  }
}

export async function fetchFeed(): Promise<ListingBase[]> {
  try {
    const { data } = await apiClient.get(FEED_ENDPOINTS.FEED);
    return extractList<ListingBase>(data);
  } catch {
    const results = await Promise.allSettled([
      fetchCars({ limit: 4 }),
      fetchRealEstate({ limit: 4 }),
      fetchMotorcycles({ limit: 4 }),
      fetchMarketplace({ limit: 4 }),
      fetchBoats({ limit: 2 }),
      fetchFarmEquipment({ limit: 2 }),
    ]);
    return results.flatMap((r) => (r.status === 'fulfilled' ? (r.value as ListingBase[]) : []));
  }
}
