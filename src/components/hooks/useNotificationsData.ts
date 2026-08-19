import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../actions/core/notifications.actions';
import type { Notification } from '../../util/types/notification.types';
import { useAppDispatch } from '../../store/store';
import { markAllRead as markAllReadAction, markOneRead as markOneReadAction } from '../features/notifications/store/notificationsSlice';

export function useNotificationsData() {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function load(signal?: AbortSignal) {
    if (!user) { setLoading(false); return; }
    const uid = user._id || (user as any).id;
    getNotifications(uid, signal)
      .then((data) => setNotifications(data))
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
    await markAllNotificationsRead(uid).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    dispatch(markAllReadAction());
  }

  async function markOneRead(id: string) {
    await markNotificationRead(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    dispatch(markOneReadAction(id));
  }

  return { user, notifications, loading, refreshing, onRefresh, markAllRead, markOneRead };
}
