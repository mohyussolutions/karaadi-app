import { apiClient, extractList } from './client';
import { FAVORITES_ENDPOINTS } from './urls';
import type { Favorite } from '../types';

export async function getFavorites(): Promise<Favorite[]> {
  const { data } = await apiClient.get(FAVORITES_ENDPOINTS.LIST);
  return extractList<Favorite>(data);
}

export async function addFavorite(listingId: string, listingType: string): Promise<void> {
  await apiClient.post(FAVORITES_ENDPOINTS.ADD, { listingId, listingType });
}

export async function removeFavorite(id: string): Promise<void> {
  await apiClient.delete(FAVORITES_ENDPOINTS.REMOVE(id));
}

export async function checkFavorite(listingId: string, type: string): Promise<boolean> {
  try {
    const { data } = await apiClient.get(FAVORITES_ENDPOINTS.CHECK(listingId, type));
    return data?.isFavorite ?? false;
  } catch {
    return false;
  }
}
