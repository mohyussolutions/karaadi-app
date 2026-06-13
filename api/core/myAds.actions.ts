import { apiClient } from '../client';
import { MY_ADS_ENDPOINTS } from '../../constants';
import { extractList } from '../../utils/helpers';
import type { ListingBase } from '../../utils/types/listing.types';

export async function getMyAds(signal?: AbortSignal): Promise<ListingBase[]> {
  const { data } = await apiClient.get(MY_ADS_ENDPOINTS.LIST, { signal });
  return extractList<ListingBase>(data);
}

export async function deleteMyAd(id: string): Promise<void> {
  await apiClient.delete(MY_ADS_ENDPOINTS.DELETE(id));
}
