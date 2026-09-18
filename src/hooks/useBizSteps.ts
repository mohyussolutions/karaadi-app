import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import { BIZ_STEPS } from '../navigation/config/navConfig';
import type { StepItem } from '../util/types';

export function useBizSteps(): StepItem[] {
  const { t } = useAppTranslation();
  return useMemo(
    () => BIZ_STEPS.map((step) => ({ key: step.key, label: t(step.labelKey) })),
    [t],
  );
}
