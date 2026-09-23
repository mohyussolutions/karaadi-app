import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/hooks/authStore';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../actions/core/notifications.actions';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  markAllRead as markAllReadAction,
  markOneRead as markOneReadAction,
  mergeServerNotifications,
} from '../components/features/notifications/store/notificationsSlice';

export function useNotificationsData() {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const uid = user?._id || user?.id;
  const notifications = useAppSelector((s) => s.notifications.items);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback((signal?: AbortSignal) => {
    if (!uid) { setLoading(false); return; }
    getNotifications(uid, signal)
      .then((data) => dispatch(mergeServerNotifications(data)))
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, [uid, dispatch]);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, [load]);

  const markAllRead = useCallback(async () => {
    if (!uid) return;
    dispatch(markAllReadAction());
    await markAllNotificationsRead(uid).catch(() => {});
  }, [uid, dispatch]);

  const markOneRead = useCallback(async (id: string) => {
    const target = notifications.find((n) => n._id === id);
    dispatch(markOneReadAction(id));
    if (target && !target.local) await markNotificationRead(id).catch(() => {});
  }, [notifications, dispatch]);

  return { user, notifications, loading, refreshing, onRefresh, markAllRead, markOneRead };
}
