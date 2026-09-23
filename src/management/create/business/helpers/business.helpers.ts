import type { Business, BusinessScreen } from '../../../../util/types/business.types';

export { getApiErrorMessage } from '../../../../util/helpers';
export type { BusinessScreen } from '../../../../util/types/business.types';

function isExpired(business: Business | null | undefined): boolean {
  return !!business?.expiryDate && new Date(business.expiryDate) < new Date();
}

function needsCategories(business: Business | null | undefined): boolean {
  return (business?.categories?.length ?? 0) === 0;
}

export function nextScreenAfterApproval(business: Business): BusinessScreen {
  if (needsCategories(business)) return 'categories';
  if (!business.planId || isExpired(business)) return 'plan';
  return 'post';
}

export function businessPlanTierKey(durationDays: number): string {
  if (durationDays >= 90) return 'premium';
  if (durationDays >= 60) return 'standard';
  return 'basic';
}
