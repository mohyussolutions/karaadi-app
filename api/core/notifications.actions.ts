import { apiClient } from '../client';
import { NOTIFICATIONS_ENDPOINTS } from '../../constants';

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { data } = await apiClient.get(NOTIFICATIONS_ENDPOINTS.UNREAD_COUNT(userId));
  return data?.count ?? data?.unreadCount ?? 0;
}
