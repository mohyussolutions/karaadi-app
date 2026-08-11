import { MAIN_CATEGORIES } from '../../constants/categories';

export const BUSINESS_TYPE_ICON: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.icon]),
);

export const BUSINESS_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  MAIN_CATEGORIES.map((c) => [c.key, c.name]),
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
