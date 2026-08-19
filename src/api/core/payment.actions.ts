import { apiClient } from '../client';
import { PAYMENT_ENDPOINTS } from '../../constants';

export async function getPaymentHistory(): Promise<any[]> {
  const { data } = await apiClient.get(PAYMENT_ENDPOINTS.ME);
  return Array.isArray(data) ? data : data?.payments || [];
}

export async function initiatePayment(payload: Record<string, any>): Promise<string> {
  const { data } = await apiClient.post(PAYMENT_ENDPOINTS.MOBILE_INITIATE, payload);
  return data?.paymentRef || '';
}

export async function getPaymentStatus(paymentRef: string): Promise<string> {
  const { data } = await apiClient.get(PAYMENT_ENDPOINTS.MOBILE_STATUS(paymentRef));
  return data?.status || '';
}

export async function activateListing(catPath: string, listingId: string, payload: Record<string, any>): Promise<void> {
  await apiClient.patch(PAYMENT_ENDPOINTS.ACTIVATE(catPath, listingId), payload);
}
