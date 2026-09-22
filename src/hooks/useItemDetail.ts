import { getMarketplaceItemById } from '../actions/categories/marketplace.actions';
import { useListingDetail } from './useListingDetail';
import type { MarketplaceItem } from '../util/types/listing.types';

export function useItemDetail(id: string) {
  return useListingDetail<MarketplaceItem>(id, {
    fetchItem: getMarketplaceItemById,
    categoryHint: 'marketplace',
    listingType: 'Marketplace',
  });
}
