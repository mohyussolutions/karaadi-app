import { getVehicleDetailById } from '../actions/categories/listing.actions';
import { VEHICLE_ENDPOINTS } from '../api/paths';
import { useListingDetail } from './useListingDetail';
import type { VehicleListing } from '../util/types/listing.types';

export function useVehicleDetail(id: string, category: string) {
  return useListingDetail<VehicleListing>(id, {
    fetchItem: (itemId, signal) => {
      const ep = VEHICLE_ENDPOINTS[category] || `/api/${category}`;
      return getVehicleDetailById(itemId, ep, signal);
    },
    categoryHint: category || 'cars',
    extraDeps: [category],
  });
}
