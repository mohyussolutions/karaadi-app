import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFields } from '../management/create/new-ad/constants/fields';
import type { FieldDef, ListingType } from '../util/types';

export function useStepFormFields(categoryKey: string, listingType: ListingType | null) {
  const { t } = useTranslation();

  const allFields: Record<string, FieldDef[]> = useMemo(
    () => getFields(t as (key: string, opts?: Record<string, unknown>) => string),
    [t],
  );
  const fields: FieldDef[] = useMemo(
    () => (allFields[categoryKey] || []).filter(
      (f: FieldDef) => f.key !== 'website' || listingType === 'public',
    ),
    [allFields, categoryKey, listingType],
  );

  const primaryFields = useMemo(() => fields.filter((f) => f.required), [fields]);
  const extraFields = useMemo(() => fields.filter((f) => !f.required), [fields]);

  return { fields, primaryFields, extraFields };
}
