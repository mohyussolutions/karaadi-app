import type { Plan, SubPlanConfig } from '../../utils/types';
import { getSubPlans } from './fee.actions';
import { PLAN_CATALOG } from "../constants";

export async function fetchPlansFromAPI(force = false): Promise<Plan[]> {
  const data = await getSubPlans(force);
  const config: SubPlanConfig = Array.isArray(data) ? (data[0] ?? {}) : (data ?? {});
  const configId = String(config._id || config.id || '');
  const plans = PLAN_CATALOG.map((p) => ({
    ...p,
    _id: configId || p.key,
    price: Number(config[p.key]) || 0,
  }));
  return plans;
}
