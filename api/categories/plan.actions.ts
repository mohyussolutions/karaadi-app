import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../constants';
import { BASE_PLANS } from '../../features/new-ad/constants/config';
import type { Plan } from '../../util/types/new-ad.types';
import { getSubPlans } from './fee.actions';

export async function fetchPlansFromAPI(): Promise<Plan[]> {
  const data = await getSubPlans();
  const config: Record<string, any> = Array.isArray(data) ? (data[0] ?? {}) : (data ?? {});
  const configId = String(config._id || config.id || '');
  return BASE_PLANS.map((p) => ({
    ...p,
    _id: configId || p.key,
    price: Number(config[p.key]) || 0,
  }));
}

export async function patchListingPlan(adId: string, planId: string, isPaid = true) {
  try {
    const { data } = await apiClient.patch(PAYMENT_ENDPOINTS.AD_PATCH(adId), { isPaid, planId });
    return { success: true, data };
  } catch {
    return { success: false };
  }
}
