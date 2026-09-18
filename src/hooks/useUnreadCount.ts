import { useMemo } from 'react';
import type { Notification } from '../util/types';

export function useUnreadCount(notifications: Notification[]) {
  return useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
}
