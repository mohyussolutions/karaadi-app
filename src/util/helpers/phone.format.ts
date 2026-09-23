import {
  PHONE_REGEX, REGEX_LEADING_ZERO, REGEX_PHONE_CLEAN, REGEX_SOMALI_COUNTRY_CODE, SOMALI_DIAL_CODE,
} from '../../constants';
import type { PaymentMethodOption, PhoneValidationError } from '../types/new-ad.types';

function toLocalNumber(raw: string): string {
  return raw.replace(REGEX_PHONE_CLEAN, '').replace(REGEX_SOMALI_COUNTRY_CODE, '').replace(REGEX_LEADING_ZERO, '');
}

export function normalizePhone(raw: string): string {
  return SOMALI_DIAL_CODE + toLocalNumber(raw);
}

export function validatePhone(raw: string, method: PaymentMethodOption): PhoneValidationError | null {
  const cleaned = raw.replace(REGEX_PHONE_CLEAN, '');
  if (!cleaned) return { key: 'postAd.phoneRequired' };
  if (!PHONE_REGEX.test(cleaned)) return { key: 'postAd.phoneInvalid' };
  if (!toLocalNumber(cleaned).startsWith(method.prefix)) {
    return { key: 'postAd.phoneWrongPrefix', params: { method: method.label, prefix: method.prefix } };
  }
  return null;
}
