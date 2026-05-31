export const CATEGORIES = [
  { id: 'cars', label: 'Cars', icon: 'car', route: '/browse/cars', color: '#2563EB' },
  { id: 'real-estate', label: 'Real Estate', icon: 'home', route: '/browse/real-estate', color: '#059669' },
  { id: 'motorcycles', label: 'Motorcycles', icon: 'motorbike', route: '/browse/motorcycles', color: '#D97706' },
  { id: 'boats', label: 'Boats', icon: 'boat', route: '/browse/boats', color: '#0891B2' },
  { id: 'marketplace', label: 'Marketplace', icon: 'storefront', route: '/browse/marketplace', color: '#7C3AED' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase', route: '/browse/jobs', color: '#DC2626' },
  { id: 'farm-equipment', label: 'Farm Equipment', icon: 'tractor', route: '/browse/farm-equipment', color: '#65A30D' },
  { id: 'items', label: 'Items', icon: 'package-variant', route: '/browse/items', color: '#C2410C' },
  { id: 'wanted', label: 'Wanted', icon: 'hand-pointing-up', route: '/browse/wanted', color: '#BE185D' },
  { id: 'businesses', label: 'Businesses', icon: 'office-building', route: '/browse/businesses', color: '#1D4ED8' },
] as const;

export const CAR_SUBCATEGORIES = [
  'Cars For Sale', 'Electric Cars', 'Lease Cars', 'Trucks', 'Buses',
  'Trailers', 'Car Parts',
];

export const REAL_ESTATE_SUBCATEGORIES = [
  'Houses', 'Apartments', 'Land', 'Commercial', 'Offices', 'Villas',
];

export const MARKETPLACE_SUBCATEGORIES = [
  'Electronics', 'Furniture', 'Clothing', 'Sports', 'Tools', 'Other',
];
