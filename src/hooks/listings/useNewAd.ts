import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { NEW_AD_GUARDS } from '../../actions/constants';
import { FLOWS, NEW_AD_FLOW_STEPS } from '../../actions/constants/tracking.constants';
import {
  NEW_AD_RESUME_PATHS,
  WEB_CREATE_AD_PREFIX,
  WEB_CREATE_AD_SLUGS,
} from '../../actions/constants/routes.constants';
import { setStep } from '../../store/slices/newAdSlice';
import { store, useAppDispatch } from '../../store/store';
import { getFields } from '../../components/management/create/new-ad/constants/fields';
import { trackFlowStep } from '../../lib/tracking/tracker';
import {
  PLAN_COMPACT_MAX_WIDTH,
  PLAN_GRID_GAP,
  PLAN_SCROLL_PADDING,
  PLAN_WIDE_MAX_WIDTH,
} from '../../utils/styles/new-ad/stepPlan.styles';
import { useResponsive } from '../app/useResponsive';

import type { CreatedItemSummary, FieldDef, FieldDefMap, ListingType, NestedSubcategoryOptions, Plan, Step, TFn } from '../../utils/types';

export const useNewAdStepNavigation = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    (target: Step) => {
      const state = store.getState().newAd;
      const guard = NEW_AD_GUARDS[target];
      if (guard && guard(state)) dispatch(setStep(target));
    },
    [dispatch],
  );
};

const resumePathFor = (step: string, categoryKey: string): string => {
  if (step !== 'details') return NEW_AD_RESUME_PATHS[step] ?? NEW_AD_RESUME_PATHS.category;
  const slug = WEB_CREATE_AD_SLUGS[categoryKey];
  return slug ? `${WEB_CREATE_AD_PREFIX}${slug}` : NEW_AD_RESUME_PATHS.category;
};

export const useNewAdFlowTracking = (step: string, categoryKey: string) => {
  useEffect(() => {
    const mapped = NEW_AD_FLOW_STEPS[step];
    if (!mapped) return;
    trackFlowStep(FLOWS.CREATE_LISTING, mapped.step, mapped.stepIndex, resumePathFor(mapped.step, categoryKey));
  }, [step, categoryKey]);
};

export const useStepFormFields = (categoryKey: string, listingType: ListingType | null) => {
  const { t } = useTranslation();

  const allFields: FieldDefMap = useMemo(
    () => getFields(t as TFn),
    [t],
  );
  const fields: FieldDef[] = useMemo(
    () => (allFields[categoryKey] || []).filter((f: FieldDef) => f.key !== 'website' || listingType === 'public'),
    [allFields, categoryKey, listingType],
  );

  const primaryFields = useMemo(() => fields.filter((f) => f.required), [fields]);
  const extraFields = useMemo(() => fields.filter((f) => !f.required), [fields]);

  return { fields, primaryFields, extraFields };
};

export const useDisplayAttrs = (item: CreatedItemSummary | null) =>
  useMemo(
    () =>
      item?.allAttrs && item.allAttrs.length > 0 ? item.allAttrs.filter((a) => a.value && String(a.value).trim()) : [],
    [item?.allAttrs],
  );

export const useMaxPlanPrice = (plans: Plan[]) =>
  useMemo(() => (plans.length > 0 ? Math.max(...plans.map((p) => p.price)) : 0), [plans]);

export const usePlanLayout = () => {
  const { width, mainWidth, isTablet, isMobileLandscape } = useResponsive();
  const wide = isTablet || isMobileLandscape;
  const compact = !wide && width < PLAN_COMPACT_MAX_WIDTH;
  const gridCardWidth = wide
    ? Math.floor((Math.min(mainWidth - PLAN_SCROLL_PADDING * 2, PLAN_WIDE_MAX_WIDTH) - PLAN_GRID_GAP) / 2)
    : undefined;
  return { wide, compact, gridCardWidth };
};

export const useFilteredNestedOptions = (options: NestedSubcategoryOptions, search: string) => {
  const { t } = useTranslation();
  const query = search.trim().toLowerCase();
  return useMemo(
    () => (query ? options.filter((n) => t(n.labelKey).toLowerCase().includes(query)) : options),
    [options, query, t],
  );
};
