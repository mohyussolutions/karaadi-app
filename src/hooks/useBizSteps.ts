import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import type { StepItem } from '../util/types';
import { BIZ_STEPS } from "../constants";

export function useBizSteps(): StepItem[] {
  const { t } = useAppTranslation();
  return useMemo(
    () => BIZ_STEPS.map((step) => ({ key: step.key, label: t(step.labelKey) })),
    [t],
  );
}
