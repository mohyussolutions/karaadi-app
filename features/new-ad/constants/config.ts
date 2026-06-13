import type { ListingType, Step, Plan } from '../../../utils/types/new-ad.types';
export type { ListingType, Step, Plan };
import type { ColorPalette } from '../../../hooks/useTheme';
import { CAT_PATHS } from '../../../constants/categories';

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

export const PLAN_CARD_COLORS = {
  popularBadge: '#374151',
  unselectedBtn: '#111827',
} as const;

export function getPlanStyle(Colors: ColorPalette): Record<string, { color: string; icon: string; bg: string }> {
  return {
    basic:    { color: Colors.gray500, icon: 'shield-outline',  bg: Colors.gray100 },
    standard: { color: Colors.primary, icon: 'lightning-bolt', bg: Colors.primaryGhost },
    premium:  { color: '#D97706', icon: 'star',           bg: '#FFFBEB' },
  };
}

export function planStyle(plan: { key?: string }, Colors: ColorPalette) {
  const raw = plan.key || '';
  const k = raw.replace(/\d+/g, '').toLowerCase();
  const styles = getPlanStyle(Colors);
  return styles[k] || styles.basic;
}

export const BASE_PLANS = [
  {
    key: 'premium90', label: 'Premium', days: 90, popular: false,
    features: ['90 Maalmood', 'Social Media Boost', 'Safka hore (Top)', 'Premium Badge', 'Sawirro aan xadidnayn', 'Taageero 24/7 ah'],
  },
  {
    key: 'standard60', label: 'Standard', days: 60, popular: true,
    features: ['60 Maalmood', 'Raadinta sare', 'Sawirro & Muuqaal', 'Taageero chat'],
  },
  {
    key: 'basic30', label: 'Basic', days: 30, popular: false,
    features: ['30 Maalmood', 'Raadinta aasaasiga ah', '10 Sawir', 'Taageero email'],
  },
];


