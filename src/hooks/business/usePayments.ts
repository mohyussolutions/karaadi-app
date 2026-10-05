import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  INVALID_PAYMENT_AMOUNT_MESSAGE,
  MAX_POLL_ATTEMPTS,
  PAYMENT_METHODS,
  POLL_INTERVAL_MS,
  ROUTES,
} from '../../actions/constants';
import { categoryPathSegment } from '../../actions/constants/endpoints';
import { FLOWS } from '../../actions/constants/tracking.constants';
import {
  activateListingWithRetry,
  getPaymentHistory,
  getPaymentStatus,
  initiatePayment,
} from '../../actions/core/payment.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { fetchPlans, prefillForPayment, selectNewAdFeeAmount, selectNewAdFeeId } from '../../store/slices/newAdSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  getApiErrorMessage,
  getApiErrorStatus,
  normalizePhone,
  subscriptionPriceLabel,
  subscriptionToListingItem,
  validatePhone,
} from '../../lib/helpers';
import { completeFlow } from '../../lib/tracking/tracker';
import { useAppTranslation } from '../app/useAppTranslation';

import type { AppDispatch, IntervalHandle, IntervalRef, ListingBase, MessageCallback, PaymentItem, PaymentMethod, PaymentRequestInput, PaymentStatus, Subscription, Translate, UsePaymentFlowParams, VoidCallback } from '../../utils/types';

const toPaymentPrefill = (item: ListingBase) => ({
  categoryKey: item.mainCategory,
  createdId: item._id || item.id,
  createdTitle: item.title,
  createdItem: {
    title: item.title,
    price: item.price,
    images: item.images,
    categoryTag: item.category || item.mainCategory,
    mainCategory: item.mainCategory,
    region: item.region || undefined,
    city: item.city || undefined,
    description: item.description || undefined,
  },
});

export const usePayForAd = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback(
    (item: ListingBase) => {
      dispatch(prefillForPayment(toPaymentPrefill(item)));
      router.push(ROUTES.newAd);
    },
    [dispatch, router],
  );
};

const isInvalidAmountError = (err: unknown, message: string | undefined) =>
  getApiErrorStatus(err) === 400 && !!message?.toLowerCase().includes(INVALID_PAYMENT_AMOUNT_MESSAGE);

const usePaymentInputs = () => {
  const [method, setMethod] = useState<PaymentMethod>('evc');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const methodMeta = PAYMENT_METHODS.find((m) => m.key === method) ?? PAYMENT_METHODS[0];

  const selectMethod = useCallback((m: PaymentMethod) => {
    setMethod(m);
    setPhoneError('');
  }, []);

  const updatePhone = useCallback((v: string) => {
    setPhone(v);
    setPhoneError('');
  }, []);

  return { method, phone, setPhone, phoneError, setPhoneError, methodMeta, selectMethod, updatePhone };
};

const usePaymentOutcome = (clearPhone: VoidCallback) => {
  const [payStatus, setPayStatus] = useState<PaymentStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const pollRef = useRef<IntervalHandle | null>(null);
  const payingRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const fail = useCallback(
    (message: string) => {
      stopPolling();
      payingRef.current = false;
      setPayStatus('failed');
      setErrorMsg(message);
    },
    [stopPolling],
  );

  const succeed = useCallback(() => {
    stopPolling();
    payingRef.current = false;
    clearPhone();
    setPayStatus('success');
    completeFlow(FLOWS.CREATE_LISTING);
  }, [stopPolling]);

  return { payStatus, setPayStatus, errorMsg, setErrorMsg, pollRef, payingRef, stopPolling, fail, succeed };
};

const useAutoActivation = (
  total: number,
  listingId: string,
  planId: string,
  succeed: VoidCallback,
  fail: MessageCallback,
  t: Translate,
) => {
  const [autoActivating, setAutoActivating] = useState(total === 0);

  useEffect(() => {
    if (total !== 0) return;
    let cancelled = false;
    activateListingWithRetry(listingId, { isPaid: true, planId }).then((confirmed) => {
      if (cancelled) return;
      setAutoActivating(false);
      if (confirmed) succeed();
      else fail(t('postAd.activationFailed'));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return autoActivating;
};

const buildPaymentRequest = ({ method, phone, total, plan, listingId, feeId, catPath }: PaymentRequestInput) => ({
  provider: method,
  phone: normalizePhone(phone),
  amount: total,
  planAmount: plan.price,
  adId: listingId,
  planId: plan._id,
  planType: plan.key,
  feeId,
  categoryType: catPath,
});

const usePaymentPolling = (
  pollRef: IntervalRef,
  succeed: VoidCallback,
  fail: MessageCallback,
  t: Translate,
) => {
  const [pollAttempt, setPollAttempt] = useState(0);

  const startPolling = useCallback(
    (paymentRef: string) => {
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
    },
    [fail, succeed, t],
  );

  return { pollAttempt, startPolling };
};

export const usePaymentFlow = ({ plan, listingId, categoryKey }: UsePaymentFlowParams) => {
  const { t } = useAppTranslation();
  const dispatch = useAppDispatch();
  const feeAmount = useAppSelector(selectNewAdFeeAmount);
  const feeId = useAppSelector(selectNewAdFeeId);
  const catPath = categoryPathSegment(categoryKey);
  const { method, phone, setPhone, phoneError, setPhoneError, methodMeta, selectMethod, updatePhone } =
    usePaymentInputs();
  const total = feeAmount + plan.price;
  const { payStatus, setPayStatus, errorMsg, setErrorMsg, pollRef, payingRef, stopPolling, fail, succeed } =
    usePaymentOutcome(() => setPhone(''));
  const autoActivating = useAutoActivation(total, listingId, plan._id, succeed, fail, t);

  const { pollAttempt, startPolling } = usePaymentPolling(pollRef, succeed, fail, t);

  const handlePay = useCallback(async () => {
    if (payingRef.current) return;
    const invalid = validatePhone(phone, methodMeta);
    if (invalid) return setPhoneError(t(invalid.key, invalid.params));

    payingRef.current = true;
    stopPolling();
    setPayStatus('polling');
    setErrorMsg('');
    try {
      const paymentRef = await initiatePayment(
        buildPaymentRequest({ method, phone, total, plan, listingId, feeId, catPath }),
      );
      if (!paymentRef) return fail(t('postAd.paymentInitFailed'));
      startPolling(paymentRef);
    } catch (err) {
      handlePayError(err, dispatch, fail, t);
    }
  }, [phone, method, methodMeta, total, plan, listingId, feeId, catPath, startPolling, stopPolling, fail, t, dispatch]);

  const handleCancel = useCallback(() => {
    stopPolling();
    payingRef.current = false;
    setPayStatus('idle');
    setErrorMsg('');
  }, [stopPolling]);

  return {
    method,
    phone,
    phoneError,
    payStatus,
    errorMsg,
    pollAttempt,
    total,
    methodMeta,
    autoActivating,
    feeAmount,
    isPaying: payStatus === 'polling',
    selectMethod,
    updatePhone,
    handlePay,
    handleCancel,
  };
};

const handlePayError = (err: unknown, dispatch: AppDispatch, fail: MessageCallback, t: Translate) => {
  const message = getApiErrorMessage(err);
  if (isInvalidAmountError(err, message)) {
    dispatch(fetchPlans(true));
    return fail(t('postAd.paymentAmountChanged'));
  }
  fail(message || t('postAd.paymentInitFailed'));
};

const sumCompletedPayments = (payments: PaymentItem[]) =>
  payments
    .filter((p) => ['completed', 'success'].includes((p.status ?? '').toLowerCase()))
    .reduce((sum, p) => sum + (p.totalAmount ?? 0), 0);

export const usePaymentHistory = () => {
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
    if (!hasUser) {
      router.replace(ROUTES.login);
      return;
    }
    load();
  }, [hasUser, load, router]);

  const totalPaid = useMemo(() => sumCompletedPayments(payments), [payments]);

  return { user, payments, loading, totalPaid };
};

export const useSubscriptionRows = (subs: Subscription[]) => {
  const { t } = useAppTranslation();
  return useMemo(
    () =>
      subs.map((sub) => ({
        sub,
        listingItem: subscriptionToListingItem(sub),
        priceLabel: subscriptionPriceLabel(sub, t('priceOnRequest')),
      })),
    [subs, t],
  );
};
