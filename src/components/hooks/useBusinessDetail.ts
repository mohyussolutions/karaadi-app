import { useEffect, useState, useCallback } from 'react';
import { getBusinessById } from '../../actions/core/business.actions';
import type { Business } from '../../util/types/business.types';


export function useBusinessDetail(id: string) {
  const [business, setBusiness] = useState<Business | null>(null);
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
