import { useMemo } from 'react';
import { useAppTranslation } from './useAppTranslation';
import { MAIN_CATEGORIES } from '../navigation/config/navConfig';
import { BUSINESS_CATEGORY_KEY_MAP, BUSINESS_TYPE_ICON } from '../util/types/business.types';

export function useBusinessCategoryOptions(allowedBackendKeys: string[] = []) {
  const { t } = useAppTranslation();
  return useMemo(() => {
    const all = MAIN_CATEGORIES.map((c) => ({
      label: t(`categories.${c.key}`, { defaultValue: c.name }),
      value: c.key,
      icon: BUSINESS_TYPE_ICON[c.key],
    }));
    if (allowedBackendKeys.length === 0) return all;
    return all.filter((opt) => allowedBackendKeys.includes(BUSINESS_CATEGORY_KEY_MAP[opt.value]));
  }, [t, allowedBackendKeys.join(',')]);
}
