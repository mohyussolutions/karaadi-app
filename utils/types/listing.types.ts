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
  nestedSubcategory?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id?: string;
    id?: string;
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
  floor?: number;
  totalFloors?: number;
  features?: string[];
  swimmingPool?: boolean;
  gym?: boolean;
  security?: boolean;
  elevator?: boolean;
  generator?: boolean;
  waterSupply?: boolean;
  airConditioning?: boolean;
  garden?: boolean;
  balcony?: boolean;
  parking?: boolean;
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
  companyLogo?: string;
  employmentType?: string;
  type?: string;
  location?: string;
}

export interface WantedItem extends ListingBase {}

export interface Subscription {
  id: string;
  _id?: string;
  userId: string;
  title: string;
  category: string;
  subCategory?: string;
  nestedSubCategory?: string;
  region: string;
  cities: string[];
  selectedCityIds?: string[];
  customCities?: string[];
  description?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  brand?: string;
  model?: string;
  isActive?: boolean;
  status?: string;
  notificationCount?: number;
  lastNotified?: string | null;
  expiryDate?: string | null;
  createdAt?: string;
  metadata?: Record<string, unknown>;
  user?: {
    _id?: string;
    id?: string;
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

export interface SubscriptionPayload {
  userId: string;
  title: string;
  category: string;
  subCategory?: string;
  nestedSubCategory?: string;
  region: string;
  cities: string[];
  selectedCityIds: string[];
  customCities: string[];
  description?: string;
  priceMin?: number;
  priceMax?: number;
  images?: string[];
}

export interface WantedFormState {
  title: string;
  category: string;
  subCategory: string;
  nestedSubCategory: string;
  priceMin: string;
  priceMax: string;
  region: string;
  city: string;
  description: string;
  images: string[];
}

export type AnyListing = Car | RealEstate | Motorcycle | Boat | MarketplaceItem | FarmEquipment | Job | WantedItem;

export interface VehicleListing extends ListingBase {
  brand?: string;
  model?: string;
  vehicleModel?: string;
  modelName?: string;
  boatModel?: string;
  traktortModel?: string;
  year?: number;
  mileage?: number;
  hours?: string | number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  type?: string;
  length?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface Favorite {
  id: string;
  userId?: string;
  itemId: string;
  title: string;
  description?: string;
  price?: string;
  image?: string;
  category?: string;
  createdAt: string;
}

export interface SearchResult {
  _id: string;
  id: string;
  title: string;
  price: number;
  images: string[];
  region?: string;
  city?: string;
  category?: string;
  mainCategory?: string;
  createdAt: string;
}
