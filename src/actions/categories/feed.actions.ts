import { apiClient } from '../client';
import { extractList, normalizeItem } from '../../util/helpers';
import {
  CARS_ENDPOINTS, REAL_ESTATE_ENDPOINTS, MOTORCYCLES_ENDPOINTS,
  BOATS_ENDPOINTS, MARKETPLACE_ENDPOINTS, FARM_EQUIPMENT_ENDPOINTS,
  JOBS_ENDPOINTS, FEED_ENDPOINTS,
} from '../../api/endpoints';
import { FEED_GROUPS, FEED_DEFAULT_PAGE, FEED_FALLBACK_LIMIT, RECOMMENDED_LIMIT, type FeedGroup } from '../../constants/constants';
import type { Car, RealEstate, Motorcycle, Boat, MarketplaceItem, FarmEquipment, ListingBase } from '../../util/types/listing.types';
import type { Params } from '../../util/types/common.types';

export async function fetchCars(params?: Params, signal?: AbortSignal): Promise<Car[]> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.LIST, { params, signal });
  return extractList<Car>(data);
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data } = await apiClient.get(CARS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchRealEstate(params?: Params, signal?: AbortSignal): Promise<RealEstate[]> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.LIST, { params, signal });
  return extractList<RealEstate>(data);
}

export async function fetchRealEstateById(id: string): Promise<RealEstate> {
  const { data } = await apiClient.get(REAL_ESTATE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMotorcycles(params?: Params, signal?: AbortSignal): Promise<Motorcycle[]> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.LIST, { params, signal });
  return extractList<Motorcycle>(data);
}

export async function fetchMotorcycleById(id: string): Promise<Motorcycle> {
  const { data } = await apiClient.get(MOTORCYCLES_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchBoats(params?: Params, signal?: AbortSignal): Promise<Boat[]> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.LIST, { params, signal });
  return extractList<Boat>(data);
}

export async function fetchBoatById(id: string): Promise<Boat> {
  const { data } = await apiClient.get(BOATS_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchMarketplace(params?: Params, signal?: AbortSignal): Promise<MarketplaceItem[]> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.LIST, { params, signal });
  return extractList<MarketplaceItem>(data);
}

export async function fetchMarketplaceById(id: string): Promise<MarketplaceItem> {
  const { data } = await apiClient.get(MARKETPLACE_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchFarmEquipment(params?: Params, signal?: AbortSignal): Promise<FarmEquipment[]> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.LIST, { params, signal });
  return extractList<FarmEquipment>(data);
}

export async function fetchFarmEquipmentById(id: string): Promise<FarmEquipment> {
  const { data } = await apiClient.get(FARM_EQUIPMENT_ENDPOINTS.BY_ID(id));
  return normalizeItem(data);
}

export async function fetchJobs(params?: Params, signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get(JOBS_ENDPOINTS.LIST, { params, signal });
  return extractList<ListingBase>(data);
}

export async function fetchByCategory(categoryKey: string, params?: Params, signal?: AbortSignal): Promise<ListingBase[]> {
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

export async function fetchFeedGroup(group: FeedGroup, signal?: AbortSignal, page = FEED_DEFAULT_PAGE): Promise<ListingBase[]> {
  try {
    const { data } = await apiClient.get(FEED_ENDPOINTS.GROUP(group, page), { signal });
    return extractList<ListingBase>(data);
  } catch {
    if (group !== FEED_GROUPS.FAST || page !== FEED_DEFAULT_PAGE) return [];
    const results = await Promise.allSettled([
      fetchCars({ limit: FEED_FALLBACK_LIMIT.LARGE }, signal),
      fetchRealEstate({ limit: FEED_FALLBACK_LIMIT.LARGE }, signal),
      fetchMotorcycles({ limit: FEED_FALLBACK_LIMIT.LARGE }, signal),
      fetchMarketplace({ limit: FEED_FALLBACK_LIMIT.LARGE }, signal),
      fetchBoats({ limit: FEED_FALLBACK_LIMIT.SMALL }, signal),
      fetchFarmEquipment({ limit: FEED_FALLBACK_LIMIT.SMALL }, signal),
    ]);
    return results.flatMap((r) => (r.status === 'fulfilled' ? (r.value as ListingBase[]) : []));
  }
}

export async function fetchFeedPage(page: number, signal?: AbortSignal): Promise<ListingBase[]> {
  const [fast, slow] = await Promise.all([
    fetchFeedGroup(FEED_GROUPS.FAST, signal, page),
    fetchFeedGroup(FEED_GROUPS.SLOW, signal, page),
  ]);
  return [...fast, ...slow];
}

export async function fetchFeed(signal?: AbortSignal): Promise<ListingBase[]> {
  return fetchFeedGroup(FEED_GROUPS.FAST, signal);
}

export async function getRecommendedByEndpoint(endpoint: string, signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get<ListingBase[] | { listings?: ListingBase[]; items?: ListingBase[] }>(endpoint, { params: { limit: RECOMMENDED_LIMIT }, signal });
  return Array.isArray(data) ? data : data?.listings || data?.items || [];
}

export async function getHomeFeedRecommendations(userId: string, signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get<ListingBase[] | { listings?: ListingBase[] }>(FEED_ENDPOINTS.RECOMMENDATIONS, { params: { userId }, signal });
  return Array.isArray(data) ? data : data?.listings || [];
}

export async function trackItemView(externalId: string, category: string, userId?: string | null): Promise<void> {
  if (!userId) return;
  await apiClient.post(FEED_ENDPOINTS.TRACK_VIEW, { externalId, category, userId }).catch(() => {});
}
