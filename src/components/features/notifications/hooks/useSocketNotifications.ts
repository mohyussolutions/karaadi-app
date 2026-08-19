import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { addNotification, markOneRead, markAllRead, removeNotification, clearNotifications } from '../store/notificationsSlice';
import { getSocket } from '../../../../api/sockets/socket.actions';
import { playNotificationSound } from '../services/soundService';

function toNotification(userId: string, type: string, data: any) {
  return {
    _id: String(data?.id ?? Date.now()),
    userId,
    title: data?.title ?? 'Karaadi',
    body: data?.message ?? data?.body ?? 'You have a new notification',
    type: data?.category ?? type,
    read: false,
    data: data?.link ? { link: data.link } : undefined,
    createdAt: data?.createdAt ?? new Date().toISOString(),
  };
}

function isForCurrentUser(payload: any, userId: string): boolean {
  const owner = payload?.userId ?? payload?.targetUserId ?? payload?.ownerId ?? payload?.recipientId;
  return owner == null || String(owner) === String(userId);
}

export function useSocketNotifications() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (!user?.id) return;

    function attach() {
      const socket = getSocket();
      if (!socket) return;

      function handleOne(type: string) {
        return (payload: any) => {
          if (!isForCurrentUser(payload, user!.id)) return;
          playNotificationSound();
          dispatch(addNotification(toNotification(user!.id, type, payload)));
        };
      }

      function handleMany(type: string) {
        return (payload: any) => {
          const list = (Array.isArray(payload) ? payload : [payload]).filter((item) => isForCurrentUser(item, user!.id));
          if (list.length === 0) return;
          playNotificationSound();
          list.forEach((item) => dispatch(addNotification(toNotification(user!.id, type, item))));
        };
      }

      const events: Array<[string, (payload: any) => void]> = [
        ['newNotification', handleOne('notification')],
        ['newNotifications', handleMany('subscription_alert')],
        ['subscription_match', handleOne('subscription_match')],
        ['wanted_match', handleOne('wanted_match')],
        ['i_have_this', handleOne('i_have_this')],
        ['notification', handleOne('notification')],
        ['notificationRead', (payload) => { if (payload?.notificationId) dispatch(markOneRead(payload.notificationId)); }],
        ['allNotificationsRead', () => dispatch(markAllRead())],
        ['notificationDeleted', (payload) => { if (payload?.notificationId) dispatch(removeNotification(payload.notificationId)); }],
        ['allNotificationsDeleted', () => dispatch(clearNotifications())],
      ];

      function bind() {
        events.forEach(([event, handler]) => {
          socket!.off(event, handler);
          socket!.on(event, handler);
        });
      }

      bind();
      socket.on('connect', bind);
    }

    attach();
    const t = setTimeout(attach, 800);
    return () => clearTimeout(t);
  }, [user?.id, dispatch]);
}
