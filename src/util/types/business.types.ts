import { MAIN_CATEGORIES } from '../../constants';

export const BUSINESS_TYPE_ICON: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.icon]),
);

export const BUSINESS_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.name]),
);

export const BUSINESS_CATEGORY_KEY_MAP: Record<string, string> = {
  RealEstate: 'realestate',
  Cars: 'motor',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'farmequipment',
  Marketplace: 'marketplace',
};

export const BUSINESS_CATEGORY_KEY_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(BUSINESS_CATEGORY_KEY_MAP).map(([k, v]) => [v, k]),
);

export interface BusinessPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  maxListings: number;
  categories: string[];
  features: string[];
  isActive: boolean;
}

export interface BusinessApplyFormState {
  name: string;
  orgNumber: string;
  email: string;
  phone: string;
  contactName: string;
  website: string;
  address: string;
  description: string;
}
