import { getRealEstateById } from '../actions/categories/realEstate.actions';
import { useListingDetail } from './useListingDetail';
import type { RealEstate } from '../util/types/listing.types';

export function useRealEstateDetail(id: string) {
  return useListingDetail<RealEstate>(id, {
    fetchItem: getRealEstateById,
    categoryHint: 'realestate',
    listingType: 'RealEstate',
  });
}
