import type { ListingType, Step, Plan } from '../../../../util/types/new-ad.types';
export type { ListingType, Step, Plan };
import { CAT_PATHS } from '../../../../api/paths';

export const CATEGORY_ENDPOINTS: Record<string, string> = {
  Marketplace: CAT_PATHS.marketplace,
  Cars: CAT_PATHS.cars,
  RealEstate: CAT_PATHS.realEstate,
  Motorcycles: CAT_PATHS.motorcycles,
  Boats: CAT_PATHS.boats,
  farmequipment: CAT_PATHS.farmEquipment,
  Jobs: CAT_PATHS.jobs,
};

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

