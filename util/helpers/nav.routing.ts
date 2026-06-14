const VEHICLE_CATS = new Set([
  'cars', 'motorcycles', 'boats',
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

export type ListingRoute =
  | { pathname: '/listing/vehicle/[id]'; params: { id: string; category: string } }
  | { pathname: '/listing/real-estate/[id]'; params: { id: string } }
  | { pathname: '/listing/job/[id]'; params: { id: string } }
  | { pathname: '/listing/item-detail/[id]'; params: { id: string } };

export function getListingDetailRoute(
  item: { id?: string; _id?: string; mainCategory?: string; category?: string },
  categoryKey?: string,
): ListingRoute {
  const id = item.id || item._id || '';

  if (categoryKey) {
    if (VEHICLE_CAT_KEYS.has(categoryKey)) {
      return {
        pathname: '/listing/vehicle/[id]',
        params: { id, category: CATEGORY_KEY_TO_VEHICLE_PARAM[categoryKey] ?? categoryKey.toLowerCase() },
      };
    }
    if (categoryKey === 'RealEstate') return { pathname: '/listing/real-estate/[id]', params: { id } };
    if (categoryKey === 'Jobs') return { pathname: '/listing/job/[id]', params: { id } };
  }

  const cat = (item.mainCategory || item.category || '').toLowerCase();

  if (VEHICLE_CATS.has(cat)) {
    return { pathname: '/listing/vehicle/[id]', params: { id, category: cat } };
  }
  if (cat === 'realestate' || cat === 'real-estate') {
    return { pathname: '/listing/real-estate/[id]', params: { id } };
  }
  if (cat === 'jobs' || cat === 'job') {
    return { pathname: '/listing/job/[id]', params: { id } };
  }
  if (cat === 'marketplace') {
    return { pathname: '/listing/item-detail/[id]', params: { id } };
  }

  return { pathname: '/listing/item-detail/[id]', params: { id } };
}
