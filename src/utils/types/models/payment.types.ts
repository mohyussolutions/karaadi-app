export interface PaymentStatusConfig {
  label: string;
  color: string;
}

export type PaymentMethod = 'evc' | 'zaad' | 'sahal' | 'waafi';

export type PaymentStatus = 'idle' | 'polling' | 'success' | 'failed';

export interface PaymentMethodOption {
  key: PaymentMethod;
  label: string;
  sublabel: string;
  prefix: string;
  color: string;
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

export interface InitiatePaymentPayload {
  provider: PaymentMethod;
  phone: string;
  amount: number;
  planAmount: number;
  adId: string;
  planId: string;
  planType: string;
  feeId?: string;
  categoryType: string;
}

export interface ActivateListingPayload {
  isPaid: boolean;
  planId?: string;
}

export type PhoneErrorKey = 'postAd.phoneRequired' | 'postAd.phoneInvalid' | 'postAd.phoneWrongPrefix';

export interface PhoneValidationError {
  key: PhoneErrorKey;
  params?: Record<string, string>;
}
