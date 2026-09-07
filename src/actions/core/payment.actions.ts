import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../api/urls';
import type { PaymentItem, InitiatePaymentPayload, ActivateListingPayload } from '../../util/types/new-ad.types';

export async function getPaymentHistory(signal?: AbortSignal): Promise<PaymentItem[]> {
  const { data } = await apiClient.get<PaymentItem[] | { data?: PaymentItem[] }>(PAYMENT_ENDPOINTS.ME, { signal });
  return Array.isArray(data) ? data : data?.data || [];
}

export async function initiatePayment(payload: InitiatePaymentPayload): Promise<string> {
  const { data } = await apiClient.post<{ paymentRef?: string }>(PAYMENT_ENDPOINTS.MOBILE_INITIATE, payload);
  return data?.paymentRef || '';
}

export async function getPaymentStatus(paymentRef: string, signal?: AbortSignal): Promise<string> {
  const { data } = await apiClient.get<{ status?: string }>(PAYMENT_ENDPOINTS.MOBILE_STATUS(paymentRef), { signal });
  return data?.status || '';
}

export async function activateListing(catPath: string, listingId: string, payload: ActivateListingPayload): Promise<void> {
  await apiClient.patch(PAYMENT_ENDPOINTS.ACTIVATE(catPath, listingId), payload);
}
