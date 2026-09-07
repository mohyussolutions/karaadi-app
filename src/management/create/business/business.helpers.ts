import type { Business } from '../../../util/types/business.types';

export { getApiErrorMessage } from '../../../util/helpers';

export type BusinessScreen = 'plan' | 'apply' | 'approval' | 'categories' | 'post';

export function isExpired(business: Business | null | undefined): boolean {
  return !!business?.expiryDate && new Date(business.expiryDate) < new Date();
}

export function needsCategories(business: Business | null | undefined): boolean {
  return (business?.categories?.length ?? 0) === 0;
}

export function nextScreenAfterApproval(business: Business): BusinessScreen {
  if (needsCategories(business)) return 'categories';
  if (!business.planId || isExpired(business)) return 'plan';
  return 'post';
}
