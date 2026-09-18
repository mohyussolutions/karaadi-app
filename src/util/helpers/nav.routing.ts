import type { ListingRoute } from '../types/common.types';
import { ROUTES } from '../../constants/constants';

export type { ListingRoute };

const VEHICLE_CATS = new Set([
  'cars', 'motorcycles', 'boats', 'car', 'motorcycle', 'boat',
  'farmequipment', 'farm-equipment',
  'traktor', 'tractor',
]);

const VEHICLE_CAT_KEYS = new Set(['Cars', 'Motorcycles', 'Boats', 'farmequipment']);

const CATEGORY_KEY_TO_VEHICLE_PARAM: Record<string, string> = {
  Cars: 'cars',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'farmequipment',
};

export function getListingDetailRoute(
  item: { id?: string; _id?: string; mainCategory?: string; category?: string },
  categoryKey?: string,
): ListingRoute {
  const id = item.id || item._id || '';

  if (categoryKey) {
    if (VEHICLE_CAT_KEYS.has(categoryKey)) {
      return {
        pathname: ROUTES.vehicleDetail,
        params: { id, category: CATEGORY_KEY_TO_VEHICLE_PARAM[categoryKey] ?? categoryKey.toLowerCase() },
      };
    }
    if (categoryKey === 'RealEstate') return { pathname: ROUTES.realEstateDetail, params: { id } };
    if (categoryKey === 'Jobs') return { pathname: ROUTES.jobDetail, params: { id } };
  }

  const cat = (item.mainCategory || item.category || '').toLowerCase();

  if (VEHICLE_CATS.has(cat)) {
    return { pathname: ROUTES.vehicleDetail, params: { id, category: cat } };
  }
  if (cat === 'realestate' || cat === 'real-estate') {
    return { pathname: ROUTES.realEstateDetail, params: { id } };
  }
  if (cat === 'jobs' || cat === 'job') {
    return { pathname: ROUTES.jobDetail, params: { id } };
  }
  if (cat === 'marketplace') {
    return { pathname: ROUTES.itemDetail, params: { id } };
  }

  return { pathname: ROUTES.itemDetail, params: { id } };
}
