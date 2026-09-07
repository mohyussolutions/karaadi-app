import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/hooks/authStore';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../actions/core/notifications.actions';
import type { Notification } from '../../util/types/notification.types';
import { useAppDispatch } from '../../store/store';
import { markAllRead as markAllReadAction, markOneRead as markOneReadAction } from '../features/notifications/store/notificationsSlice';

export function useNotificationsData() {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const uid = user?._id || user?.id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((signal?: AbortSignal) => {
    if (!uid) { setLoading(false); return; }
    getNotifications(uid, signal)
      .then((data) => setNotifications(data))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, [uid]);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

  const markAllRead = useCallback(async () => {
    if (!uid) return;
    await markAllNotificationsRead(uid).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    dispatch(markAllReadAction());
  }, [uid, dispatch]);

  const markOneRead = useCallback(async (id: string) => {
    await markNotificationRead(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    dispatch(markOneReadAction(id));
  }, [dispatch]);

  return { user, notifications, loading, refreshing, onRefresh, markAllRead, markOneRead };
}
