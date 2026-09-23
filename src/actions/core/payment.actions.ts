import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS, MY_ADS_ENDPOINTS } from '../../api/endpoints';
import { ACTIVATE_RETRY_ATTEMPTS, ACTIVATE_RETRY_DELAY_MS } from '../../constants';
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

async function activateListing(listingId: string, payload: ActivateListingPayload): Promise<void> {
  await apiClient.patch(MY_ADS_ENDPOINTS.PATCH(listingId), payload);
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function activateListingWithRetry(listingId: string, payload: ActivateListingPayload): Promise<boolean> {
  for (let attempt = 1; attempt <= ACTIVATE_RETRY_ATTEMPTS; attempt++) {
    try {
      await activateListing(listingId, payload);
      return true;
    } catch {
      if (attempt < ACTIVATE_RETRY_ATTEMPTS) await wait(ACTIVATE_RETRY_DELAY_MS);
    }
  }
  return false;
}
