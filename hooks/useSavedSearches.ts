import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { getSearchHistory, deleteSearchHistory } from '../api/search/searchHistory';


export function useSavedSearches() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const ctrl = new AbortController();
    getSearchHistory(ctrl.signal)
      .then((data) => setSearches(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [user]);

  function deleteSearch(id: string) {
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
  }

  return { searches, loading, deleteSearch };
}
