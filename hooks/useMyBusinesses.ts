import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { BUSINESSES_ENDPOINTS } from '../constants';

export function useMyBusinesses() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await apiClient.get(BUSINESSES_ENDPOINTS.MY, { signal });
      setBusinesses(Array.isArray(data) ? data : data?.businesses || []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  function onRefresh() { setRefreshing(true); load(); }

  function handleDelete(item: any) {
    Alert.alert(
      t('mine.businesses.delete'),
      `${t('mine.businesses.delete')} "${item.name}"?`,
      [
        { text: t('mine.businesses.cancel'), style: 'cancel' },
        {
          text: t('mine.businesses.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(BUSINESSES_ENDPOINTS.DELETE(item._id || item.id));
              setBusinesses((prev) => prev.filter((b) => (b._id || b.id) !== (item._id || item.id)));
            } catch {
              Alert.alert('Error', 'Failed to delete. Please try again.');
            }
          },
        },
      ],
    );
  }

  return { user, businesses, loading, refreshing, onRefresh, handleDelete };
}
