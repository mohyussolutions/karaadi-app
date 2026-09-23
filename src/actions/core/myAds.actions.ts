import { apiClient } from '../client';
import { MY_ADS_ENDPOINTS } from '../../api/endpoints';
import { extractList } from '../../util/helpers';
import type { ListingBase } from '../../util/types/listing.types';

export async function getMyAds(signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get(MY_ADS_ENDPOINTS.LIST, { signal });
  return extractList<ListingBase>(data);
}

export async function getMyAdById(id: string, signal?: AbortSignal): Promise<ListingBase | null> {
  try {
    const { data } = await apiClient.get<ListingBase>(MY_ADS_ENDPOINTS.BY_ID(id), { signal });
    return data ?? null;
  } catch {
    return null;
  }
}

export async function deleteMyAd(id: string): Promise<void> {
  await apiClient.delete(MY_ADS_ENDPOINTS.DELETE(id));
}

export async function setAdSold(id: string, maGaday: boolean): Promise<boolean> {
  const { data } = await apiClient.put<{ maGaday?: boolean }>(MY_ADS_ENDPOINTS.UPDATE(id), { maGaday });
  return data?.maGaday ?? maGaday;
}
