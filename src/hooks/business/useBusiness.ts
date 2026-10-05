import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { BUSINESS_CATEGORY_KEY_MAP, BUSINESS_TYPE_ICON } from '../../actions/constants';
import { useTranslation } from 'react-i18next';

import { BIZ_STEPS, MAIN_CATEGORIES } from '../../actions/constants';
import { deleteBusiness, getBusinessById, getMyBusinesses } from '../../actions/core/business.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { useAppTranslation } from '../app/useAppTranslation';

import type { Business, BusinessStatusMetaMap, StepItem, Translate, VoidCallback } from '../../utils/types';

export const useBizSteps = (): StepItem[] => {
  const { t } = useAppTranslation();
  return useMemo(() => BIZ_STEPS.map((step) => ({ key: step.key, label: t(step.labelKey) })), [t]);
};

export const useBusinessCategoryOptions = (allowedBackendKeys: string[] = []) => {
  const { t } = useAppTranslation();
  return useMemo(() => {
    const all = MAIN_CATEGORIES.map((c) => ({
      label: t(`categories.${c.key}`, { defaultValue: c.name }),
      value: c.key,
      icon: BUSINESS_TYPE_ICON[c.key],
    }));
    if (allowedBackendKeys.length === 0) return all;
    return all.filter((opt) => allowedBackendKeys.includes(BUSINESS_CATEGORY_KEY_MAP[opt.value]));
  }, [t, allowedBackendKeys.join(',')]);
};

export const useBusinessDetail = (id: string) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getBusinessById(id);
      setBusiness(data);
    } catch {}
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { business, loading };
};

const buildStatusMeta = (t: Translate): BusinessStatusMetaMap => ({
  pending: {
    icon: 'clock-outline',
    colorKey: 'primary',
    title: t('mine.businesses.pendingTitle'),
    message: t('mine.businesses.pendingMessage'),
  },
  active: {
    icon: 'check-decagram',
    colorKey: 'success',
    title: t('mine.businesses.approvedTitle'),
    message: t('mine.businesses.approvedMessage'),
  },
  rejected: {
    icon: 'close-circle-outline',
    colorKey: 'error',
    title: t('mine.businesses.rejectedTitle'),
    message: t('mine.businesses.rejectedMessage'),
  },
});

export const useBusinessStatusMeta = () => {
  const { t } = useAppTranslation();
  return useMemo(() => buildStatusMeta(t), [t]);
};

const businessKey = (item: Business) => item._id || item.id;

const confirmDeleteBusiness = (t: Translate, name: string, onConfirm: VoidCallback) => {
  Alert.alert(t('mine.businesses.delete'), `${t('mine.businesses.delete')} "${name}"?`, [
    { text: t('mine.businesses.cancel'), style: 'cancel' },
    { text: t('mine.businesses.delete'), style: 'destructive', onPress: onConfirm },
  ]);
};

export const useMyBusinesses = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const list = await getMyBusinesses(signal);
        setBusinesses(Array.isArray(list) ? list : []);
      } catch {
        setBusinesses([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const handleDelete = useCallback(
    (item: Business) => {
      confirmDeleteBusiness(t, item.name, async () => {
        try {
          await deleteBusiness(businessKey(item) || '');
          setBusinesses((prev) => prev.filter((b) => businessKey(b) !== businessKey(item)));
        } catch {
          Alert.alert('Error', 'Failed to delete. Please try again.');
        }
      });
    },
    [t],
  );

  return { user, businesses, loading, refreshing, onRefresh, handleDelete };
};
