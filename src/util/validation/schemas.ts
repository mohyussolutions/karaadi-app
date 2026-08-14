import { z } from 'zod';
import {
  REGEX_EMAIL,
  REGEX_PASSWORD_LOWERCASE, REGEX_PASSWORD_UPPERCASE, REGEX_PASSWORD_DIGIT, REGEX_PASSWORD_SPECIAL,
  REGEX_SOMALI_PHONE_FULL, REGEX_SOMALI_PHONE_LOCAL,
  REGEX_WEBSITE, REGEX_USERNAME,
} from '../../constants';

export function isSomaliPhone(v: string): boolean {
  const cleaned = v.replace(/[\s\-()]/g, '');
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
  .regex(/^\d{6}$/, { message: 'Enter the 6-digit code' });

export const optionalWebsiteSchema = z.string().trim().max(200, { message: 'Must be 200 characters or fewer' })
  .refine((v) => v === '' || REGEX_WEBSITE.test(v), { message: 'Enter a valid website (e.g. example.com)' });

export function maxLenSchema(max: number, message = `Must be ${max} characters or fewer`) {
  return z.string().trim().max(max, { message });
}
