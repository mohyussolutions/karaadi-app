import type { Plan } from './new-ad.types';

export type PaymentMethod = 'evc' | 'zaad' | 'sahal' | 'waaafi';
export type PaymentStatus = 'idle' | 'polling' | 'success' | 'failed';

export interface PaymentMethodOption {
  key: PaymentMethod;
  label: string;
  sublabel: string;
  prefix: string;
  color: string;
}

export type PayStatus = 'idle' | 'polling' | 'success' | 'failed';

export interface UsePaymentFlowParams {
  plan: Plan;
  listingId: string;
  categoryKey: string;
}

export interface PaymentItem {
  id: string;
  totalAmount?: number;
  status?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  createdAt?: string;
  boatId?: string;
  carId?: string;
  realEstateId?: string;
  motorcycleId?: string;
  farmequipmentId?: string;
  marketplaceId?: string;
  jobId?: string;
  subscriptionId?: string;
  businessId?: string;
}
