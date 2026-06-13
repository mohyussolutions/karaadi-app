import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';

export interface Session {
  id: string;
  device?: string | null;
  browser?: string | null;
  active?: boolean;
  lastActive?: string | null;
}

export interface LoginEntry {
  id: number;
  device?: string | null;
  browser?: string | null;
  ipAddress?: string | null;
  loggedAt: string;
}

export function useSecuritySettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, clearAuth } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, histRes] = await Promise.allSettled([
        apiClient.post('/api/users/sessions'),
        apiClient.get('/api/users/login-history'),
      ]);
      setSessions(sessRes.status === 'fulfilled' ? (sessRes.value.data || []) : []);
      setHistory(histRes.status === 'fulfilled' ? (histRes.value.data || []) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { router.replace('/(auth)/login'); return; }
    fetchData();
  }, [user, fetchData, router]);

  async function removeSession(id: string) {
    try {
      await apiClient.post(`/api/users/sessions/${id}/logout`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  }

  function confirmLogoutAll() {
    Alert.alert(t('mine.security.signOutAllTitle'), t('mine.security.signOutAllConfirm'), [
      { text: t('mine.businesses.cancel'), style: 'cancel' },
      {
        text: t('mine.security.signOutAll'), style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await apiClient.post('/api/users/sessions/logout-all');
            await clearAuth();
            router.replace('/(auth)/login');
          } catch {
            setLoggingOut(false);
          }
        },
      },
    ]);
  }

  function deleteHistoryEntry(id: number) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    apiClient.delete(`/api/users/login-history/${id}`).catch(() => {});
  }

  function clearAllHistory() {
    setHistory([]);
    apiClient.delete('/api/users/login-history').catch(() => {});
  }

  return { user, clearAuth, sessions, history, loading, loggingOut, removeSession, confirmLogoutAll, deleteHistoryEntry, clearAllHistory };
}
