import { PHONE_ERROR, PHONE_REGEX, type PaymentMethodOption } from '../payment.constants';
import { REGEX_LEADING_ZERO, REGEX_PHONE_CLEAN, REGEX_SOMALI_COUNTRY_CODE } from '../../../../../../constants';

export function normalizePhone(raw: string): string {
  const cleaned = raw.replace(REGEX_PHONE_CLEAN, '');
  if (cleaned.startsWith('+252')) return cleaned;
  if (cleaned.startsWith('252')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+252' + cleaned.slice(1);
  return '+252' + cleaned;
}

export function getPhoneError(phone: string, methodMeta: PaymentMethodOption): string {
  const cleaned = phone.replace(REGEX_PHONE_CLEAN, '');
  if (!cleaned) return 'Enter your phone number';
  if (!PHONE_REGEX.test(cleaned)) return PHONE_ERROR;

  const local = cleaned.replace(REGEX_SOMALI_COUNTRY_CODE, '').replace(REGEX_LEADING_ZERO, '');
  if (!local.startsWith(methodMeta.prefix)) {
    return `${methodMeta.label} requires a number starting with ${methodMeta.prefix}`;
  }
  return '';
}
