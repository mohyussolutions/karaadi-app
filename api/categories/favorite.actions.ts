import { apiClient } from '../client';
import { extractList, getImageUrl } from '../../utils/helpers';
import { FAVORITES_ENDPOINTS } from '../../constants';
import type { Favorite } from '../../utils/types';

export async function getFavorites(): Promise<Favorite[]> {
  const { data } = await apiClient.get(`${FAVORITES_ENDPOINTS.LIST}?limit=200`);
  if (data?.favorites) return extractList<Favorite>(data.favorites);
  return extractList<Favorite>(data);
}

export async function addFavorite(listing: any, categoryHint?: string): Promise<Favorite> {
  const category = Array.isArray(listing?.category)
    ? listing.category[0]
    : (listing?.mainCategory || listing?.category || categoryHint || '');

  const { data } = await apiClient.post(FAVORITES_ENDPOINTS.ADD, {
    itemId: String(listing?.id ?? listing?._id ?? ''),
    title: listing?.title || '',
    description: listing?.description || '',
    price: listing?.price != null ? String(listing.price) : undefined,
    image: getImageUrl(listing?.images?.[0]) || undefined,
    category,
  });
  return data?.favorite || data;
}

export async function removeFavorite(id: string): Promise<void> {
  await apiClient.delete(FAVORITES_ENDPOINTS.REMOVE(id));
}
