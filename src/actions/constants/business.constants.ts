import { MAIN_CATEGORIES } from '../../categoriesListing/main-categories/mainCategories';
import type { IconMap, StringMap } from '../../utils/types';

export const BUSINESS_TYPE_ICON: IconMap = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.icon]),
) as IconMap;

export const BUSINESS_TYPE_LABEL: StringMap = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.name]),
);

export const BUSINESS_CATEGORY_KEY_MAP: StringMap = {
  RealEstate: 'realestate',
  Cars: 'motor',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'farmequipment',
  Marketplace: 'marketplace',
};

export const BUSINESS_CATEGORY_KEY_REVERSE: StringMap = Object.fromEntries(
  Object.entries(BUSINESS_CATEGORY_KEY_MAP).map(([k, v]) => [v, k]),
);
