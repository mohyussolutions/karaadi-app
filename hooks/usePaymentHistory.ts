import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { PAYMENT_ENDPOINTS } from '../constants';

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

export function usePaymentHistory() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await apiClient.get(PAYMENT_ENDPOINTS.ME);
      setPayments(Array.isArray(data) ? data : data?.payments ?? data?.data ?? []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.replace('/(auth)/login'); return; }
    load();
  }, [user, load, router]);

  const totalPaid = payments
    .filter((p) => ['completed', 'success'].includes((p.status ?? '').toLowerCase()))
    .reduce((sum, p) => sum + (p.totalAmount ?? 0), 0);

  return { user, payments, loading, totalPaid };
}
