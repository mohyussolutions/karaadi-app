import { apiClient } from '../client';
import { FEE_ENDPOINTS } from '../../api/endpoints';
import type { AllFeeConfigs, SubPlanConfig } from '../../util/types/fee.types';
import { CATEGORY_FEE_KEY, SUBCATEGORY_FEE_FIELD, SUB_PLANS_TTL } from "../../constants";
const feeUrl = (sub: string) => `${FEE_ENDPOINTS.BASE}/${sub}`;

export async function getFeeForCategory(
  categoryKey: string,
  subType?: string,
): Promise<{ feeId: string; feeAmount: number }> {
  try {
    const fees = await getAllFees();
    const key = CATEGORY_FEE_KEY[categoryKey] || 'marketplace';
    const arr = fees[key];
    if (!Array.isArray(arr) || arr.length === 0) return { feeId: '', feeAmount: 0 };
    const config = arr.find((f) => f?.isActive !== false) || arr[0];
    const fieldKey = subType ? SUBCATEGORY_FEE_FIELD[categoryKey]?.[subType] : undefined;
    return {
      feeId: String(config?.id || config?._id || ''),
      feeAmount: fieldKey ? Number(config?.[fieldKey] || 0) : 0,
    };
  } catch {
    return { feeId: '', feeAmount: 0 };
  }
}

async function getAllFees(): Promise<AllFeeConfigs> {
  try {
    const { data } = await apiClient.get<Partial<AllFeeConfigs>>(feeUrl('all'));
    return {
      marketplace:     data.marketplace     ?? [],
      realEstate:      data.realEstate      ?? [],
      cars:            data.cars            ?? [],
      motorcycles:     data.motorcycles     ?? [],
      boats:           data.boats           ?? [],
      equipment:       data.equipment       ?? [],
      subscriptionFees: data.subscriptionFees ?? [],
      subPlans:        data.subPlans        ?? [],
      system:          data.system          ?? null,
      businessPlans:   data.businessPlans   ?? [],
    };
  } catch {
    return { marketplace: [], realEstate: [], cars: [], motorcycles: [], boats: [], equipment: [], subscriptionFees: [], subPlans: [], system: null, businessPlans: [] };
  }
}

let _subPlansCache: { data: SubPlanConfig[]; at: number } | null = null;

export async function getSubPlans(): Promise<SubPlanConfig[]> {
  if (_subPlansCache && Date.now() - _subPlansCache.at < SUB_PLANS_TTL) {
    return _subPlansCache.data;
  }
  try {
    const { data } = await apiClient.get<SubPlanConfig[]>(feeUrl('sub-plans'));
    _subPlansCache = { data, at: Date.now() };
    return data;
  } catch {
    return [];
  }
}

