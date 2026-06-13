import { PHONE_ERROR, PHONE_REGEX, type PaymentMethodOption } from '../payment.constants';

export function normalizePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+252')) return cleaned;
  if (cleaned.startsWith('252')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+252' + cleaned.slice(1);
  return '+252' + cleaned;
}

export function getPhoneError(phone: string, methodMeta: PaymentMethodOption): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!cleaned) return 'Enter your phone number';
  if (!PHONE_REGEX.test(cleaned)) return PHONE_ERROR;

  const local = cleaned.replace(/^\+?252/, '').replace(/^0/, '');
  if (!local.startsWith(methodMeta.prefix)) {
    return `${methodMeta.label} requires a number starting with ${methodMeta.prefix}`;
  }
  return '';
}
