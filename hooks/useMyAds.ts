import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getMyAds, deleteMyAd } from '../api/core';
import { useAuthStore } from '../store/authStore';
import type { ListingBase } from '../util/types';

export function useMyAds() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [ads, setAds] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!user) { setLoading(false); return; }
    setError(false);
    try {
      const data = await getMyAds(signal);
      if (!signal?.aborted) setAds(data);
    } catch {
      if (!signal?.aborted) setError(true);
    } finally {
      if (!signal?.aborted) { setLoading(false); setRefreshing(false); }
    }
  }, [user]);

  useFocusEffect(useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]));

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  function retry() {
    setLoading(true);
    load();
  }

  function handleDelete(item: ListingBase) {
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
  }

  return { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete };
}
