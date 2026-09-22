import type { ListingRoute } from '../types/common.types';
import { ROUTES } from '../../constants/constants';

export type { ListingRoute };

type RouteBuilder = (id: string) => ListingRoute;

const buildCarsRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'cars' } });
const buildBoatsRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'boats' } });
const buildMotorcyclesRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'motorcycles' } });
const buildFarmEquipmentRoute: RouteBuilder = (id) => ({ pathname: ROUTES.vehicleDetail, params: { id, category: 'farmequipment' } });
const buildRealEstateRoute: RouteBuilder = (id) => ({ pathname: ROUTES.realEstateDetail, params: { id } });
const buildJobRoute: RouteBuilder = (id) => ({ pathname: ROUTES.jobDetail, params: { id } });
const buildMarketplaceRoute: RouteBuilder = (id) => ({ pathname: ROUTES.itemDetail, params: { id } });

const DEFAULT_DETAIL_ROUTE_BUILDER = buildMarketplaceRoute;

const EXACT_CATEGORY_ROUTES: Record<string, RouteBuilder> = {
  gawaari: buildCarsRoute,
  car: buildCarsRoute,
  cars: buildCarsRoute,
  boat: buildBoatsRoute,
  boats: buildBoatsRoute,
  motorcycle: buildMotorcyclesRoute,
  motorcycles: buildMotorcyclesRoute,
  matooro: buildMotorcyclesRoute,
  equipment: buildFarmEquipmentRoute,
  farmequipment: buildFarmEquipmentRoute,
  'farm equipment': buildFarmEquipmentRoute,
  'farm-equipment': buildFarmEquipmentRoute,
  traktor: buildFarmEquipmentRoute,
  tractor: buildFarmEquipmentRoute,
  realestate: buildRealEstateRoute,
  'real estate': buildRealEstateRoute,
  'real-estate': buildRealEstateRoute,
  marketplace: buildMarketplaceRoute,
  electronics: buildMarketplaceRoute,
  fashion: buildMarketplaceRoute,
  furniture: buildMarketplaceRoute,
  animals: buildMarketplaceRoute,
  sports: buildMarketplaceRoute,
  antiques: buildMarketplaceRoute,
  job: buildJobRoute,
  jobs: buildJobRoute,
  fulltime: buildJobRoute,
  parttime: buildJobRoute,
  freelance: buildJobRoute,
};

const CATEGORY_PATTERN_ROUTES: { patterns: string[]; build: RouteBuilder }[] = [
  { patterns: ['gawaari', 'car'], build: buildCarsRoute },
  { patterns: ['boat'], build: buildBoatsRoute },
  { patterns: ['motorcycle', 'matooro'], build: buildMotorcyclesRoute },
  { patterns: ['farm', 'equipment', 'traktor', 'tractor'], build: buildFarmEquipmentRoute },
  { patterns: ['estate', 'apartment', 'house', 'land', 'villa', 'iib', 'kira'], build: buildRealEstateRoute },
  { patterns: ['job'], build: buildJobRoute },
];

function findExactRouteBuilder(category: string): RouteBuilder | null {
  return EXACT_CATEGORY_ROUTES[category.toLowerCase().trim()] ?? null;
}

function findPatternRouteBuilder(category: string): RouteBuilder | null {
  const lower = category.toLowerCase().trim();
  const match = CATEGORY_PATTERN_ROUTES.find(({ patterns }) => patterns.some((pattern) => lower.includes(pattern)));
  return match?.build ?? null;
}

function buildRouteFromCategory(category: string | undefined, id: string): ListingRoute | null {
  if (!category) return null;
  const builder = findExactRouteBuilder(category) ?? findPatternRouteBuilder(category);
  return builder ? builder(id) : null;
}

export function getListingDetailRoute(
  item: { id?: string; _id?: string; mainCategory?: string; category?: string },
  categoryKey?: string,
): ListingRoute {
  const id = item.id || item._id || '';

  return (
    buildRouteFromCategory(categoryKey, id) ??
    buildRouteFromCategory(item.mainCategory, id) ??
    buildRouteFromCategory(item.category, id) ??
    DEFAULT_DETAIL_ROUTE_BUILDER(id)
  );
}
