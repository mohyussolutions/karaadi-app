import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { NestedSubcategoryPickerProps } from '../util/types/new-ad.types';

export function useFilteredNestedOptions(options: NestedSubcategoryPickerProps['options'], search: string) {
  const { t } = useTranslation();
  const query = search.trim().toLowerCase();
  return useMemo(
    () => (query ? options.filter((n) => t(n.labelKey).toLowerCase().includes(query)) : options),
    [options, query, t],
  );
}
