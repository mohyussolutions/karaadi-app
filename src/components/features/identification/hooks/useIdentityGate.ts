import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuthStore } from '../../../../store/authStore';
import { getIdentificationStatus } from '../../../../api/categories/identification.actions';
import type { IdentificationStatus } from '../../../../util/types';

export function useIdentityGate() {
  const { user } = useAuthStore();
  const userId = user?.id;
  const isAdmin = user?.isAdmin;
  const [status, setStatus] = useState<IdentificationStatus | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const checking = useRef(false);

  const check = useCallback(async () => {
    if (!userId || isAdmin || checking.current) return;
    checking.current = true;
    try {
      const data = await getIdentificationStatus();
      setStatus(data);
      setGateOpen(data.required && !data.submitted);
    } catch {
    } finally {
      checking.current = false;
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    if (!userId) {
      setGateOpen(false);
      return;
    }
    check();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => sub.remove();
  }, [userId, check]);

  const onVerified = useCallback(() => {
    setGateOpen(false);
    check();
  }, [check]);

  return {
    gateOpen,
    idCardRequired: status?.idCardRequired ?? true,
    selfieRequired: status?.selfieRequired ?? true,
    onVerified,
  };
}
