import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../constants';

const FEE = '/api/Fee';

const feeUrl = (sub: string) => `${FEE}/${sub}`;
const feeById = (sub: string, id: string) => `${FEE}/${sub}/${id}`;

const CATEGORY_FEE_KEY: Record<string, string> = {
  Cars: 'cars',
  Marketplace: 'marketplace',
  RealEstate: 'realEstate',
  Motorcycles: 'motorcycles',
  Boats: 'boats',
  farmequipment: 'equipment',
  Jobs: 'marketplace',
};

export async function getFeeForCategory(
  categoryKey: string,
  subType?: string,
): Promise<{ feeId: string; feeAmount: number }> {
  try {
    const fees = await getAllFees();
    const key = CATEGORY_FEE_KEY[categoryKey] || 'marketplace';
    const arr = (fees as any)[key];
    if (!arr || (Array.isArray(arr) && arr.length === 0)) return { feeId: '', feeAmount: 0 };
    const config = Array.isArray(arr)
      ? (subType
          ? arr.find((f: any) => f.type === subType || f.key === subType || f.subType === subType) ?? arr[0]
          : arr[0])
      : arr;
    return {
      feeId: String(config?._id || config?.id || ''),
      feeAmount: Number(config?.feeAmount || config?.amount || config?.fee || 0),
    };
  } catch {
    return { feeId: '', feeAmount: 0 };
  }
}

export async function getAllFees() {
  try {
    const { data } = await apiClient.get(feeUrl('configs'));
    return {
      marketplace:     data.marketplace     ?? [],
      realEstate:      data.realEstate      ?? [],
      cars:            data.cars            ?? [],
      motorcycles:     data.motorcycles     ?? [],
      boats:           data.boats           ?? {},
      equipment:       data.equipment       ?? [],
      subscriptionFees: data.subscriptionFees ?? [],
      subPlans:        data.subPlans        ?? [],
      system:          data.system          ?? null,
      businessPlans:   data.businessPlans   ?? [],
    };
  } catch {
    return { marketplace: [], realEstate: [], cars: [], motorcycles: [], boats: {}, equipment: [], subscriptionFees: [], subPlans: [], system: null, businessPlans: [] };
  }
}

let _subPlansCache: { data: any; at: number } | null = null;
const SUB_PLANS_TTL = 60_000;

export async function getSubPlans() {
  if (_subPlansCache && Date.now() - _subPlansCache.at < SUB_PLANS_TTL) {
    return _subPlansCache.data;
  }
  try {
    const { data } = await apiClient.get(feeUrl('sub-plans'));
    _subPlansCache = { data, at: Date.now() };
    return data;
  } catch {
    return [];
  }
}

export async function getSubPlanById(id: string) {
  try {
    const { data } = await apiClient.get(feeById('sub-plans', id));
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getSystemConfig() {
  try {
    const { data } = await apiClient.get(feeUrl('system-config'));
    return data ?? null;
  } catch {
    return null;
  }
}

async function getCategoryFees(cat: string) {
  try { const { data } = await apiClient.get(feeUrl(cat)); return Array.isArray(data) ? data : data ?? []; } catch { return []; }
}
async function getCategoryFeeById(cat: string, id: string) {
  try { const { data } = await apiClient.get(feeById(cat, id)); return data ?? null; } catch { return null; }
}
async function createCategoryFee(cat: string, body: Record<string, unknown>) {
  try { const { data } = await apiClient.post(feeUrl(cat), body); return data; } catch (e: any) { return { error: e?.response?.data?.message || 'Failed' }; }
}
async function updateCategoryFee(cat: string, id: string, body: Record<string, unknown>) {
  try { const { data } = await apiClient.patch(feeById(cat, id), body); return data; } catch (e: any) { return { error: e?.response?.data?.message || 'Failed' }; }
}
async function deleteCategoryFee(cat: string, id: string) {
  try { await apiClient.delete(feeById(cat, id)); return { success: true }; } catch { return { success: false }; }
}

export const getMarketplaceFees    = () => getCategoryFees('marketplace');
export const getMarketplaceFeeById = (id: string) => getCategoryFeeById('marketplace', id);
export const createMarketplaceFee  = (d: Record<string, unknown>) => createCategoryFee('marketplace', d);
export const updateMarketplaceFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('marketplace', id, d);
export const deleteMarketplaceFee  = (id: string) => deleteCategoryFee('marketplace', id);

export const getRealEstateFees    = () => getCategoryFees('real-estate');
export const getRealEstateFeeById = (id: string) => getCategoryFeeById('real-estate', id);
export const createRealEstateFee  = (d: Record<string, unknown>) => createCategoryFee('real-estate', d);
export const updateRealEstateFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('real-estate', id, d);
export const deleteRealEstateFee  = (id: string) => deleteCategoryFee('real-estate', id);

export const getCarFees    = () => getCategoryFees('cars');
export const getCarFeeById = (id: string) => getCategoryFeeById('cars', id);
export const createCarFee  = (d: Record<string, unknown>) => createCategoryFee('cars', d);
export const updateCarFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('cars', id, d);
export const deleteCarFee  = (id: string) => deleteCategoryFee('cars', id);

export const getMotorcycleFees    = () => getCategoryFees('motorcycles');
export const getMotorcycleFeeById = (id: string) => getCategoryFeeById('motorcycles', id);
export const createMotorcycleFee  = (d: Record<string, unknown>) => createCategoryFee('motorcycles', d);
export const updateMotorcycleFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('motorcycles', id, d);
export const deleteMotorcycleFee  = (id: string) => deleteCategoryFee('motorcycles', id);

export const getBoatFees    = () => getCategoryFees('boats');
export const getBoatFeeById = (id: string) => getCategoryFeeById('boats', id);
export const createBoatFee  = (d: Record<string, unknown>) => createCategoryFee('boats', d);
export const updateBoatFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('boats', id, d);
export const deleteBoatFee  = (id: string) => deleteCategoryFee('boats', id);

export const getEquipmentFees    = () => getCategoryFees('equipment');
export const getEquipmentFeeById = (id: string) => getCategoryFeeById('equipment', id);
export const createEquipmentFee  = (d: Record<string, unknown>) => createCategoryFee('equipment', d);
export const updateEquipmentFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('equipment', id, d);
export const deleteEquipmentFee  = (id: string) => deleteCategoryFee('equipment', id);

export const getSubscriptionFees    = () => getCategoryFees('subscription');
export const getSubscriptionFeeById = (id: string) => getCategoryFeeById('subscription', id);
export const createSubscriptionFee  = (d: Record<string, unknown>) => createCategoryFee('subscription', d);
export const updateSubscriptionFee  = (id: string, d: Record<string, unknown>) => updateCategoryFee('subscription', id, d);
export const deleteSubscriptionFee  = (id: string) => deleteCategoryFee('subscription', id);

export const getBusinessPlanFees   = () => getCategoryFees('business-plans');
export const createBusinessPlanFee = (d: Record<string, unknown>) => createCategoryFee('business-plans', d);
export const updateBusinessPlanFee = (id: string, d: Record<string, unknown>) => updateCategoryFee('business-plans', id, d);

export async function patchAdPayment(adId: string, isPaid: boolean, planId?: string) {
  try {
    const { data } = await apiClient.patch(PAYMENT_ENDPOINTS.AD_PATCH(adId), { isPaid, ...(planId ? { planId } : {}) });
    return { success: true, data };
  } catch {
    return { success: false };
  }
}
