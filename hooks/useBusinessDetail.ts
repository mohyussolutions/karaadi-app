import { useEffect, useState, useCallback } from 'react';
import { getBusinessById } from '../api/core/business.actions';


export function useBusinessDetail(id: string) {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getBusinessById(id);
      setBusiness(data);
    } catch {}
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return { business, loading };
}
