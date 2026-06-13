import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../store/store';
import { apiClient } from '../api/client';
import { BUSINESSES_ENDPOINTS } from '../constants';

export function useBusinessDirectory() {
  const user = useAppSelector((s) => s.auth.user);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await apiClient.get(BUSINESSES_ENDPOINTS.LIST);
      setBusinesses(Array.isArray(data) ? data : data?.businesses || []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function onRefresh() { setRefreshing(true); load(); }

  return { user, businesses, loading, refreshing, onRefresh };
}
