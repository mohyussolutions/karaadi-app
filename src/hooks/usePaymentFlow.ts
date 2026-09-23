import { useCallback, useEffect, useRef, useState } from 'react';
import { activateListingWithRetry, getPaymentStatus, initiatePayment } from '../actions/core/payment.actions';
import { CATEGORY_ENDPOINTS } from '../api/endpoints';
import { useAppSelector } from '../store/store';
import { useAppTranslation } from './useAppTranslation';
import { getApiErrorMessage, normalizePhone, validatePhone } from '../util/helpers';
import { MAX_POLL_ATTEMPTS, PAYMENT_METHODS, POLL_INTERVAL_MS } from '../constants';
import type { PaymentMethod, PaymentStatus, UsePaymentFlowParams } from '../util/types';

export function usePaymentFlow({ plan, listingId, categoryKey }: UsePaymentFlowParams) {
  const { t } = useAppTranslation();
  const feeAmount = useAppSelector((s) => s.newAd.feeAmount);
  const feeId = useAppSelector((s) => s.newAd.feeId);
  const catPath = (CATEGORY_ENDPOINTS[categoryKey] || '/api/marketplace').replace('/api/', '');

  const [method, setMethod] = useState<PaymentMethod>('evc');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [payStatus, setPayStatus] = useState<PaymentStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [pollAttempt, setPollAttempt] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const payingRef = useRef(false);

  const total = feeAmount + plan.price;
  const methodMeta = PAYMENT_METHODS.find((m) => m.key === method) ?? PAYMENT_METHODS[0];
  const [autoActivating, setAutoActivating] = useState(total === 0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const fail = useCallback((message: string) => {
    stopPolling();
    payingRef.current = false;
    setPayStatus('failed');
    setErrorMsg(message);
  }, [stopPolling]);

  const succeed = useCallback(() => {
    stopPolling();
    payingRef.current = false;
    setPhone('');
    setPayStatus('success');
  }, [stopPolling]);

  useEffect(() => {
    if (total !== 0) return;
    let cancelled = false;
    activateListingWithRetry(listingId, { isPaid: true, planId: plan._id }).then((confirmed) => {
      if (cancelled) return;
      setAutoActivating(false);
      if (confirmed) succeed();
      else fail(t('postAd.activationFailed'));
    });
    return () => { cancelled = true; };
  }, []);

  const startPolling = useCallback((paymentRef: string) => {
    let attempts = 0;
    setPollAttempt(0);
    pollRef.current = setInterval(async () => {
      attempts += 1;
      setPollAttempt(attempts);
      try {
        const status = await getPaymentStatus(paymentRef);
        if (status === 'success') return succeed();
        if (status === 'failed') return fail(t('postAd.paymentDeclined'));
      } catch {}
      if (attempts >= MAX_POLL_ATTEMPTS) fail(t('postAd.paymentTimedOut'));
    }, POLL_INTERVAL_MS);
  }, [fail, succeed, t]);

  const handlePay = useCallback(async () => {
    if (payingRef.current) return;
    const invalid = validatePhone(phone, methodMeta);
    if (invalid) { setPhoneError(t(invalid.key, invalid.params)); return; }

    payingRef.current = true;
    stopPolling();
    setPayStatus('polling');
    setErrorMsg('');
    try {
      const paymentRef = await initiatePayment({
        provider: method, phone: normalizePhone(phone),
        amount: total, planAmount: plan.price,
        adId: listingId, planId: plan._id, planType: plan.key,
        feeId, categoryType: catPath,
      });
      if (!paymentRef) return fail(t('postAd.paymentInitFailed'));
      startPolling(paymentRef);
    } catch (err) {
      fail(getApiErrorMessage(err) || t('postAd.paymentInitFailed'));
    }
  }, [phone, method, methodMeta, total, plan, listingId, feeId, catPath, startPolling, stopPolling, fail, t]);

  const handleCancel = useCallback(() => {
    stopPolling();
    payingRef.current = false;
    setPayStatus('idle');
    setErrorMsg('');
  }, [stopPolling]);

  const selectMethod = useCallback((m: PaymentMethod) => {
    setMethod(m);
    setPhoneError('');
  }, []);

  const updatePhone = useCallback((v: string) => {
    setPhone(v);
    setPhoneError('');
  }, []);

  return {
    method, phone, phoneError, payStatus, errorMsg, pollAttempt,
    total, methodMeta, autoActivating, feeAmount,
    isPaying: payStatus === 'polling',
    selectMethod, updatePhone, handlePay, handleCancel,
  };
}
