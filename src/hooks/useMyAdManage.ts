import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getMyAdById, setAdSold } from '../actions/core/myAds.actions';
import type { ListingBase } from '../util/types';

export function useMyAdManage(id: string | undefined) {
  const { t } = useTranslation();
  const [ad, setAd] = useState<ListingBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!id) { setLoading(false); setNotFound(true); return; }
    setNotFound(false);
    try {
      const data = await getMyAdById(id, signal);
      if (signal?.aborted) return;
      if (data) setAd(data); else setNotFound(true);
    } catch {
      if (!signal?.aborted) setNotFound(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => {
    const ctrl = new AbortController();
    setLoading(true);
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]));

  const toggleSold = useCallback(async () => {
    if (!ad) return;
    const adId = ad._id || ad.id;
    const nextValue = !ad.maGaday;
    setAd((prev) => (prev ? { ...prev, maGaday: nextValue } : prev));
    setToggling(true);
    try {
      const confirmed = await setAdSold(adId, nextValue);
      setAd((prev) => (prev ? { ...prev, maGaday: confirmed } : prev));
    } catch {
      setAd((prev) => (prev ? { ...prev, maGaday: !nextValue } : prev));
      Alert.alert(t('auth.common.error'), t('mine.myAds.toggleSoldFailed'));
    } finally {
      setToggling(false);
    }
  }, [ad, t]);

  return { ad, loading, notFound, toggling, toggleSold };
}
