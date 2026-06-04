export interface ListingBase {
  _id: string;
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  region: string;
  city: string;
  images: string[];
  isPaid?: boolean;
  isActive?: boolean;
  maGaday?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  expiryDate?: string | null;
  mainCategory: string;
  category?: string;
  subcategory?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

export interface Car extends ListingBase {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  type: string;
}

export interface RealEstate extends ListingBase {
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished?: boolean;
}

export interface Motorcycle extends ListingBase {
  brand: string;
  model: string;
  year: number;
  mileage: number;
}

export interface Boat extends ListingBase {
  brand: string;
  model: string;
  year: number;
  length?: number;
}

export interface MarketplaceItem extends ListingBase {
  condition?: string;
}

export interface FarmEquipment extends ListingBase {
  brand?: string;
  model?: string;
  year?: number;
}

export interface Job extends ListingBase {
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  company?: string;
  requirements?: string;
}

export interface WantedItem extends ListingBase {}

export type AnyListing = Car | RealEstate | Motorcycle | Boat | MarketplaceItem | FarmEquipment | Job | WantedItem;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
