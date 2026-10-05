import type { ListingBase, Subscription } from '../models/listing.types';
import type { PaymentMethod } from '../models/payment.types';
import type { Plan } from '../models/plan.types';

export interface PaymentRequestInput {
  method: PaymentMethod;
  phone: string;
  total: number;
  plan: UsePaymentFlowParams['plan'];
  listingId: string;
  feeId: string;
  catPath: string;
}

export interface UsePaymentFlowParams {
  plan: Plan;
  listingId: string;
  categoryKey: string;
}

export interface SubscriptionRow {
  sub: Subscription;
  listingItem: ListingBase;
  priceLabel: string;
}
