import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/hooks/authStore';
import { getPaymentHistory } from '../actions/core/payment.actions';
import type { PaymentItem } from '../util/types/new-ad.types';

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

  const hasUser = !!user;

  useEffect(() => {
    if (!hasUser) { router.replace('/(auth)/login'); return; }
    load();
  }, [hasUser, load, router]);

  const totalPaid = useMemo(
    () => payments
      .filter((p) => ['completed', 'success'].includes((p.status ?? '').toLowerCase()))
      .reduce((sum, p) => sum + (p.totalAmount ?? 0), 0),
    [payments],
  );

  return { user, payments, loading, totalPaid };
}
