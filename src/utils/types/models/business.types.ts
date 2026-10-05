export interface BusinessPlan {
  id: string;
  _id?: string;
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

export interface Business {
  _id?: string;
  id?: string;
  name: string;
  orgNumber?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  contactName?: string;
  website?: string;
  address?: string;
  description?: string;
  logo?: string;
  images?: string[];
  categories?: string[];
  category?: string;
  type?: string;
  city?: string;
  region?: string;
  status?: string;
  isVerified?: boolean;
  planId?: string;
  expiryDate?: string | null;
}

export type BusinessScreen = 'plan' | 'apply' | 'approval' | 'categories' | 'post';

export type BusinessStepIndexMap = Record<BusinessScreen, number>;
export type BusinessApplyField = keyof BusinessApplyFormState;
