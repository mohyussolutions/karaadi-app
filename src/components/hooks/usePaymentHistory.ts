import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { getPaymentHistory } from '../../actions/core/payment.actions';
import type { PaymentItem } from '../../util/types/payment.types';

export type { PaymentItem };

export function usePaymentHistory() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const items = await getPaymentHistory();
      setPayments(items);
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
