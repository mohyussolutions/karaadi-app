import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../../../api/client';
import { PAYMENT_ENDPOINTS } from '../../../constants';
import { CATEGORY_ENDPOINTS } from '../../../features/new-ad/constants/config';
import { useAppSelector } from '../../../store';
import type { PayMethod, Plan } from '../../../utils/types';
import { MAX_POLL_ATTEMPTS, PAYMENT_METHODS, POLL_INTERVAL_MS } from '../payment.constants';
import { getPhoneError, normalizePhone } from './phone.utils';

export type PayStatus = 'idle' | 'polling' | 'success' | 'failed';

interface UsePaymentFlowParams {
  plan: Plan;
  listingId: string;
  categoryKey: string;
}

export function usePaymentFlow({ plan, listingId, categoryKey }: UsePaymentFlowParams) {
  const feeAmount = useAppSelector((s) => s.newAd.feeAmount);
  const feeId = useAppSelector((s) => s.newAd.feeId);
  const catPath = (CATEGORY_ENDPOINTS[categoryKey] || '/api/marketplace').replace('/api/', '');

  const [method, setMethod] = useState<PayMethod>('evc');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [payStatus, setPayStatus] = useState<PayStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [pollAttempt, setPollAttempt] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const total = feeAmount + plan.price;
  const methodMeta = PAYMENT_METHODS.find((m) => m.key === method)!;

  const [autoActivating, setAutoActivating] = useState(total === 0);
  useEffect(() => {
    if (total !== 0) return;
    apiClient.patch(PAYMENT_ENDPOINTS.ACTIVATE(catPath, listingId), {
      isPaid: true, planId: plan._id, planAmount: plan.price, planType: plan.key,
    })
      .catch(() => {})
      .finally(() => { setAutoActivating(false); setPayStatus('success'); });
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const startPolling = useCallback((paymentRef: string) => {
    let attempts = 0;
    setPollAttempt(0);
    pollRef.current = setInterval(async () => {
      attempts++;
      setPollAttempt(attempts);
      try {
        const { data } = await apiClient.get(PAYMENT_ENDPOINTS.MOBILE_STATUS(paymentRef));
        const status: string = data?.status || '';
        if (status === 'success') {
          stopPolling();
          try {
            await apiClient.patch(PAYMENT_ENDPOINTS.ACTIVATE(catPath, listingId), {
              isPaid: true, planId: plan._id, planAmount: plan.price, planType: plan.key,
            });
          } catch {}
          setPayStatus('success');
          return;
        }
        if (status === 'failed') {
          stopPolling();
          setPayStatus('failed');
          setErrorMsg('Payment was declined. Please try again.');
          return;
        }
      } catch {}
      if (attempts >= MAX_POLL_ATTEMPTS) {
        stopPolling();
        setPayStatus('failed');
        setErrorMsg('Payment confirmation timed out. Please try again.');
      }
    }, POLL_INTERVAL_MS);
  }, [catPath, listingId, plan, stopPolling]);

  const handlePay = useCallback(async () => {
    const error = getPhoneError(phone, methodMeta);
    if (error) { setPhoneError(error); return; }

    stopPolling();
    setPayStatus('polling');
    setErrorMsg('');
    try {
      const { data } = await apiClient.post(PAYMENT_ENDPOINTS.MOBILE_INITIATE, {
        provider: method, phone: normalizePhone(phone),
        amount: total, planAmount: plan.price,
        adId: listingId, planId: plan._id, planType: plan.key,
        feeId, categoryType: catPath,
      });
      const paymentRef: string = data?.paymentRef || '';
      if (!paymentRef) {
        setPayStatus('failed');
        setErrorMsg('Payment initiation failed — no reference returned. Please try again.');
        return;
      }
      startPolling(paymentRef);
    } catch (err: any) {
      setPayStatus('failed');
      setErrorMsg(err?.response?.data?.message || err?.response?.data?.error || 'Payment initiation failed. Please try again.');
    }
  }, [phone, method, methodMeta, total, plan, listingId, feeId, catPath, startPolling, stopPolling]);

  const handleCancel = useCallback(() => {
    stopPolling();
    setPayStatus('idle');
    setErrorMsg('');
  }, [stopPolling]);

  const selectMethod = useCallback((m: PayMethod) => {
    setMethod(m);
    setPhoneError('');
  }, []);

  const updatePhone = useCallback((v: string) => {
    setPhone(v);
    setPhoneError((prev) => (prev ? '' : prev));
  }, []);

  return {
    method, phone, phoneError, payStatus, errorMsg, pollAttempt,
    total, methodMeta, autoActivating, feeAmount,
    selectMethod, updatePhone, handlePay, handleCancel,
  };
}
