import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getMyAds, deleteMyAd } from '../actions/core/myAds.actions';
import { useAuthStore } from '../store/hooks/authStore';
import type { ListingBase } from '../util/types';

export function useMyAds() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const hasUser = !!user;
  const [ads, setAds] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!hasUser) { setLoading(false); return; }
    setError(false);
    try {
      const data = await getMyAds(signal);
      if (!signal?.aborted) setAds(data);
    } catch {
      if (!signal?.aborted) setError(true);
    } finally {
      if (!signal?.aborted) { setLoading(false); setRefreshing(false); }
    }
  }, [hasUser]);

  useFocusEffect(useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const retry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  const handleDelete = useCallback((item: ListingBase) => {
    const id = item._id || item.id;
    Alert.alert(
      t('mine.myAds.delete'),
      `${t('mine.myAds.deleteConfirm')} "${item.title}"?`,
      [
        { text: t('auth.common.cancel'), style: 'cancel' },
        {
          text: t('mine.myAds.delete'),
          style: 'destructive',
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteMyAd(id);
              setAds((prev) => prev.filter((a) => (a._id || a.id) !== id));
            } catch {
              Alert.alert(t('auth.common.error'), t('mine.myAds.deleteFailed'));
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  }, [t]);

  return { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete };
}
