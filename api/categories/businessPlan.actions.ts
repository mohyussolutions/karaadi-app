import { apiClient } from '../client';
import { BUSINESS_PLAN_ENDPOINTS } from '../../constants';
import type { BusinessPlan } from '../../utils/types';

export async function fetchBusinessPlans(): Promise<BusinessPlan[]> {
  const { data } = await apiClient.get(BUSINESS_PLAN_ENDPOINTS.PLANS);
  const plans: BusinessPlan[] = Array.isArray(data) ? data : data?.plans || [];
  return plans.filter((p) => p.isActive);
}

export async function selectBusinessPlan(businessId: string, planId: string) {
  const { data } = await apiClient.post(BUSINESS_PLAN_ENDPOINTS.SELECT_PLAN(businessId), { planId });
  return data?.business || data;
}

export async function extendBusinessPlan(businessId: string, planId: string) {
  const { data } = await apiClient.post(BUSINESS_PLAN_ENDPOINTS.EXTEND_PLAN(businessId), { planId });
  return data?.business || data;
}
