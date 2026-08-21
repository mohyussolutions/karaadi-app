import { z } from 'zod';
import {
  REGEX_CONFIRMATION_CODE,
  REGEX_EMAIL,
  REGEX_PASSWORD_LOWERCASE, REGEX_PASSWORD_UPPERCASE, REGEX_PASSWORD_DIGIT, REGEX_PASSWORD_SPECIAL,
  REGEX_PHONE_CLEAN,
  REGEX_SOMALI_PHONE_FULL, REGEX_SOMALI_PHONE_LOCAL,
  REGEX_WEBSITE, REGEX_USERNAME,
} from '../../constants';
import type { FieldDef } from '../types';

export function isSomaliPhone(v: string): boolean {
  const cleaned = v.replace(REGEX_PHONE_CLEAN, '');
  return REGEX_SOMALI_PHONE_FULL.test(cleaned) || REGEX_SOMALI_PHONE_LOCAL.test(cleaned);
}

export function isValidWebsite(v: string): boolean {
  return REGEX_WEBSITE.test(v);
}

export const emailSchema = z.string().trim()
  .min(1, { message: 'Email is required' })
  .regex(REGEX_EMAIL, { message: 'Enter a valid email address' });

export const passwordSchema = z.string()
  .min(8, { message: 'At least 8 characters' })
  .regex(REGEX_PASSWORD_LOWERCASE, { message: 'Add a lowercase letter' })
  .regex(REGEX_PASSWORD_UPPERCASE, { message: 'Add an uppercase letter' })
  .regex(REGEX_PASSWORD_DIGIT, { message: 'Add a number' })
  .regex(REGEX_PASSWORD_SPECIAL, { message: 'Add a special character' });

export const usernameSchema = z.string().trim()
  .min(3, { message: 'At least 3 characters' })
  .max(30, { message: 'At most 30 characters' })
  .regex(REGEX_USERNAME, { message: 'Letters, numbers, underscore and period only' });

export const somaliPhoneSchema = z.string().trim()
  .refine(isSomaliPhone, { message: 'Enter a valid Somali phone number' });

export const optionalSomaliPhoneSchema = z.string().trim()
  .refine((v) => v === '' || isSomaliPhone(v), { message: 'Enter a valid Somali phone number' });

export const confirmationCodeSchema = z.string().trim()
  .regex(REGEX_CONFIRMATION_CODE, { message: 'Enter the 6-digit code' });

export const optionalWebsiteSchema = z.string().trim().max(200, { message: 'Must be 200 characters or fewer' })
  .refine((v) => v === '' || REGEX_WEBSITE.test(v), { message: 'Enter a valid website (e.g. example.com)' });

export function maxLenSchema(max: number, message = `Must be ${max} characters or fewer`) {
  return z.string().trim().max(max, { message });
}

const MAX_TEXT_LENGTH = 300;
const MAX_TEXTAREA_LENGTH = 3000;

export function validateStepForm(
  fields: FieldDef[],
  formData: Record<string, string>,
  images: string[],
  t: (key: string, opts?: Record<string, unknown>) => string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((f) => {
    if (f.required && !formData[f.key]?.trim()) {
      errors[f.key] = t('postAd.fieldRequired', { label: f.label });
      return;
    }
    if (f.key === 'year' && formData.year && !/^\d{4}$/.test(formData.year)) {
      errors.year = t('postAd.invalidYear');
    }
    if (f.key === 'price' && formData.price && Number(formData.price) < 0) {
      errors.price = t('postAd.negativePrice');
    }
    if (f.key === 'website' && formData.website?.trim() && !isValidWebsite(formData.website.trim())) {
      errors.website = t('postAd.invalidWebsite');
    }
    if (f.type === 'textarea' && (formData[f.key]?.length ?? 0) > MAX_TEXTAREA_LENGTH) {
      errors[f.key] = t('postAd.fieldTooLong', { label: f.label });
    }
    if (f.type === 'text' && (formData[f.key]?.length ?? 0) > MAX_TEXT_LENGTH) {
      errors[f.key] = t('postAd.fieldTooLong', { label: f.label });
    }
  });
  if (images.length < 2)
    errors._images = t('postAd.minPhotosRequired');
  return errors;
}
