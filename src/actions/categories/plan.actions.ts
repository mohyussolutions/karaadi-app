import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../api/endpoints';
import { PLAN_CATALOG } from '../../policy/planCatalog';
import type { Plan } from '../../util/types/new-ad.types';
import type { SubPlanConfig } from '../../util/types/fee.types';
import { getSubPlans } from './fee.actions';

export async function fetchPlansFromAPI(): Promise<Plan[]> {
  const data = await getSubPlans();
  const config: SubPlanConfig = Array.isArray(data) ? (data[0] ?? {}) : (data ?? {});
  const configId = String(config._id || config.id || '');
  const plans = PLAN_CATALOG.map((p) => ({
    ...p,
    _id: configId || p.key,
    price: Number(config[p.key]) || 0,
  }));
  return plans;
}

export async function patchListingPlan(adId: string, planId: string, isPaid = true) {
  try {
    const { data } = await apiClient.patch(PAYMENT_ENDPOINTS.AD_PATCH(adId), { isPaid, planId });
    return { success: true, data };
  } catch {
    return { success: false };
  }
}
