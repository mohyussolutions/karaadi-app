import { useMemo } from 'react';
import { z } from 'zod';
import { useAppTranslation } from './useAppTranslation';
import { isSomaliPhone, isValidWebsite } from '../util/validation/schemas';

export function useBusinessApplySchema() {
  const { t } = useAppTranslation();
  return useMemo(() => z.object({
    name: z.string().trim().min(1, { message: t('mine.businesses.nameRequired') }).max(150, { message: t('mine.businesses.nameTooLong') }),
    orgNumber: z.string().trim().max(50),
    email: z.string().trim().min(1, { message: t('mine.businesses.emailRequired') }).email({ message: t('mine.businesses.emailInvalid') }),
    phone: z.string().trim().min(1, { message: t('mine.businesses.phoneRequired') })
      .refine(isSomaliPhone, { message: t('mine.businesses.phoneInvalid') }),
    contactName: z.string().trim().max(100, { message: t('mine.businesses.contactNameTooLong') }),
    website: z.string().trim().max(200)
      .refine((v) => v === '' || isValidWebsite(v), { message: t('mine.businesses.websiteInvalid') }),
    address: z.string().trim().max(200, { message: t('mine.businesses.addressTooLong') }),
    description: z.string().trim().max(2000, { message: t('mine.businesses.descriptionTooLong') }),
  }), [t]);
}
