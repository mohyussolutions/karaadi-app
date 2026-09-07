import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/hooks/authStore';
import { getMyBusinesses, deleteBusiness } from '../actions/core/business.actions';
import type { Business } from '../util/types/business.types';

export function useMyBusinesses() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!user) { setLoading(false); return; }
    try {
      const list = await getMyBusinesses(signal);
      setBusinesses(Array.isArray(list) ? list : []);
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

  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

  const handleDelete = useCallback((item: Business) => {
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
              await deleteBusiness(item._id || item.id || '');
              setBusinesses((prev) => prev.filter((b) => (b._id || b.id) !== (item._id || item.id)));
            } catch {
              Alert.alert('Error', 'Failed to delete. Please try again.');
            }
          },
        },
      ],
    );
  }, [t]);

  return { user, businesses, loading, refreshing, onRefresh, handleDelete };
}
