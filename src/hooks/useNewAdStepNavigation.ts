import { useCallback } from 'react';
import { store, useAppDispatch } from '../store/store';
import { setStep } from '../store/slices/newAdSlice';
import type { NewAdState, Step } from '../util/types';

const NEW_AD_GUARDS: Record<Step, (state: NewAdState) => boolean> = {
  login: () => true,
  type: () => true,
  category: (s) => s.listingType !== null,
  form: (s) => !!s.categoryKey,
  plan: (s) => s.submitStatus === 'success' && !!s.createdId,
  summary: (s) => s.selectedPlan !== null,
  payment: (s) => s.selectedPlan !== null && s.submitStatus === 'success',
};

export function useNewAdStepNavigation() {
  const dispatch = useAppDispatch();

  return useCallback(
    (target: Step) => {
      const state = store.getState().newAd;
      const guard = NEW_AD_GUARDS[target];
      if (guard && guard(state)) dispatch(setStep(target));
    },
    [dispatch],
  );
}
