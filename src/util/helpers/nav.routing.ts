import type { ListingRoute, RouteBuilder } from '../types/common.types';
import { EXACT_CATEGORY_ROUTES, CATEGORY_PATTERN_ROUTES, DEFAULT_DETAIL_ROUTE_BUILDER } from '../../constants/configs';

export type { ListingRoute };

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
