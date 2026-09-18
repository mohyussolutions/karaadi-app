import type { ListingType, Step, Plan } from '../../../../../util/types/new-ad.types';
export type { ListingType, Step, Plan };

export { CATEGORY_ENDPOINTS } from '../../../../../api/endpoints';

export const CATEGORY_ITEM_MODEL: Record<string, string> = {
  Marketplace: 'MarketplaceItem',
  Cars: 'Car',
  RealEstate: 'RealEstate',
  Motorcycles: 'Motorcycle',
  Boats: 'Boat',
  farmequipment: 'FarmEquipment',
  Jobs: 'Job',
};

export const CATEGORY_MAIN_LABEL: Record<string, string> = {
  Marketplace: 'Marketplace',
  Cars: 'Cars',
  RealEstate: 'Real Estate',
  Motorcycles: 'Motorcycles',
  Boats: 'Boats',
  farmequipment: 'Farm Equipment',
  Jobs: 'Jobs',
};

