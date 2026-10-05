import type { CreatedItemSummary } from '../models/newAd.types';
import type { User } from '../models/user.types';

export interface SessionPayload {
  user: User;
  token: string;
}

export interface FeeInfoPayload {
  feeId: string;
  feeAmount: number;
}

export interface PrefillForPaymentPayload {
  categoryKey: string;
  createdId: string;
  createdTitle: string;
  createdItem: CreatedItemSummary;
}
