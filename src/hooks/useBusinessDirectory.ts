import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '../store/store';
import { getBusinessList } from '../actions/core/business.actions';
import type { Business } from '../util/types/business.types';


export function useBusinessDirectory() {
  const user = useAppSelector((s) => s.auth.user);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getBusinessList();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch {
      setBusinesses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

  return { user, businesses, loading, refreshing, onRefresh };
}
