import { apiClient } from '../../../api/client';
import { NOTIFICATIONS_ENDPOINTS } from '../../../constants';

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { data } = await apiClient.get(NOTIFICATIONS_ENDPOINTS.STATS(userId));
  return data?.stats?.unread ?? 0;
}

export async function getNotifications(userId: string, signal?: AbortSignal): Promise<any[]> {
  const { data } = await apiClient.get(NOTIFICATIONS_ENDPOINTS.LIST(userId), { signal });
  return Array.isArray(data) ? data : data?.notifications || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_READ(id));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await apiClient.patch(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ(userId));
}
