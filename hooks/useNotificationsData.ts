import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { NOTIFICATIONS_ENDPOINTS } from '../constants';
import type { Notification } from '../utils/types';

export function useNotificationsData() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function load(signal?: AbortSignal) {
    if (!user) { setLoading(false); return; }
    const uid = user._id || (user as any).id;
    apiClient.get(NOTIFICATIONS_ENDPOINTS.LIST(uid), { signal })
      .then(({ data }) => setNotifications(Array.isArray(data) ? data : data?.notifications || []))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [user]);

  function onRefresh() { setRefreshing(true); load(); }

  async function markAllRead() {
    const uid = user?._id || (user as any)?.id;
    await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ(uid)).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markOneRead(id: string) {
    await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_READ(id)).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  return { user, notifications, loading, refreshing, onRefresh, markAllRead, markOneRead };
}
