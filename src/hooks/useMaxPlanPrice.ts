import { useMemo } from 'react';
import type { Plan } from '../util/types/new-ad.types';

export function useMaxPlanPrice(plans: Plan[]) {
  return useMemo(
    () => (plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0),
    [plans],
  );
}
