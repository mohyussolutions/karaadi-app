import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/hooks/authStore';
import { getSearchHistory, deleteSearchHistory } from '../actions/search/searchHistory';
import type { SearchHistoryItem } from '../util/types/browse.types';


export function useSavedSearches() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const uid = user?._id || user?.id;
  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const ctrl = new AbortController();
    getSearchHistory(ctrl.signal)
      .then((data) => setSearches(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [uid]);

  const deleteSearch = useCallback((id: string) => {
    Alert.alert(t('auth.common.error'), `${t('common.back')}?`, [
      { text: t('auth.common.ok'), style: 'cancel' },
      {
        text: t('businesses.myAds.delete'), style: 'destructive',
        onPress: () => {
          setSearches((prev) => prev.filter((s) => (s._id || s.id) !== id));
          deleteSearchHistory(id);
        },
      },
    ]);
  }, [t]);

  return { searches, loading, deleteSearch };
}
