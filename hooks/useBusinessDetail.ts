import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../api/client';
import { BUSINESSES_ENDPOINTS } from '../constants';

export function useBusinessDetail(id: string) {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await apiClient.get(BUSINESSES_ENDPOINTS.BY_ID(id));
      setBusiness(data);
    } catch {}
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { business, loading };
}
