export type PaymentMethod = 'evc' | 'zaad' | 'sahal';
export type PaymentStatus = 'idle' | 'polling' | 'success' | 'failed';

export interface PaymentMethodOption {
  key: PaymentMethod;
  label: string;
  sublabel: string;
  prefix: string;
  color: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { key: 'evc',   label: 'EVC Plus', sublabel: 'Hormuud (+252 61)',  prefix: '61', color: '#E53935' },
  { key: 'zaad',  label: 'Zaad',     sublabel: 'Telesom (+252 63)',  prefix: '63', color: '#1976D2' },
  { key: 'sahal', label: 'Sahal',    sublabel: 'Somtel (+252 90)',   prefix: '90', color: '#388E3C' },
];

export const MAX_POLL_ATTEMPTS = 30;
export const POLL_INTERVAL_MS  = 3000;

export const PHONE_REGEX = /^(\+?252|0)?(61|63|90)\d{7}$/;
export const PHONE_ERROR  = 'Enter a valid Somali number: 061XXXXXXX, +252 61XXXXXXX (EVC), 063XXXXXXX (Zaad), 090XXXXXXX (Sahal)';
