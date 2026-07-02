import { Platform } from 'react-native';
import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../constants';
import { BASE_PLANS } from '../../features/new-ad/constants/config';
import type { Plan } from '../../util/types/new-ad.types';
import { getSubPlans } from './fee.actions';

export async function fetchPlansFromAPI(): Promise<Plan[]> {
  const data = await getSubPlans();
  const config: Record<string, any> = Array.isArray(data) ? (data[0] ?? {}) : (data ?? {});
  const configId = String(config._id || config.id || '');
  const plans = BASE_PLANS.map((p) => ({
    ...p,
    _id: configId || p.key,
    price: Number(config[p.key]) || 0,
  }));

  // Apple guideline 3.1.1: paid plan upgrades are digital feature unlocks currently
  // sold via EVC/Zaad outside Apple's In-App Purchase system. Until StoreKit/IAP is
  // implemented, only free plans are offered on iOS so the app never routes users to
  // pay outside the app. Android keeps the full EVC/Zaad flow.
  if (Platform.OS === 'ios') {
    return plans.filter((p) => p.price === 0);
  }
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
