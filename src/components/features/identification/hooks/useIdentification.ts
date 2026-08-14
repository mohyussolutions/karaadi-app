import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { getIdentificationStatus, submitIdentification } from '../api/identification.actions';
import type { IdentificationStatus } from '../../../../util/types';

export function useIdentification() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<IdentificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!user) { setLoading(false); return; }
    setError(false);
    try {
      const data = await getIdentificationStatus();
      if (!signal?.aborted) setStatus(data);
    } catch {
      if (!signal?.aborted) setError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const submit = useCallback(async (idCardImage?: string, selfieImage?: string) => {
    setSubmitting(true);
    try {
      await submitIdentification({ idCardImage, selfieImage });
      setStatus((prev) => (prev ? { ...prev, submitted: true } : prev));
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { user, status, loading, error, submitting, submit, reload: load };
}
