import { apiClient } from '../client';
import { NOTIFICATIONS_ENDPOINTS } from '../../api/endpoints';
import type { Notification, ServerNotification } from '../../util/types/notification.types';
import { NOTIFICATIONS_FETCH_LIMIT } from "../../constants";

function normalizeNotification(raw: ServerNotification): Notification {
  return {
    _id: String(raw.id ?? raw._id ?? ''),
    userId: String(raw.userId ?? ''),
    title: raw.title ?? 'Karaadi',
    body: raw.message ?? raw.body ?? '',
    type: raw.category ?? raw.type ?? 'notification',
    read: Boolean(raw.isRead ?? raw.read),
    data: raw.itemId
      ? { type: 'alert_match', listingId: raw.itemId, category: raw.itemType ?? undefined }
      : undefined,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { data } = await apiClient.get<{ stats?: { unread?: number } }>(NOTIFICATIONS_ENDPOINTS.STATS(userId));
  return data?.stats?.unread ?? 0;
}

export async function getNotifications(userId: string, signal?: AbortSignal): Promise<Notification[]> {
  const { data } = await apiClient.get<ServerNotification[] | { notifications?: ServerNotification[] }>(
    NOTIFICATIONS_ENDPOINTS.LIST(userId),
    { signal, params: { limit: NOTIFICATIONS_FETCH_LIMIT } },
  );
  const list = Array.isArray(data) ? data : data?.notifications || [];
  return list.map(normalizeNotification).filter((n) => n._id);
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_READ(id));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ(userId));
}
