import { apiClient } from '../client';
import { SECURITY_ENDPOINTS } from '../../api/endpoints';
import type { Session, LoginEntry } from '../../util/types/user.types';

export async function getSessions(): Promise<Session[]> {
  const { data } = await apiClient.post<Session[] | { sessions?: Session[] }>(SECURITY_ENDPOINTS.SESSIONS);
  return Array.isArray(data) ? data : data?.sessions || [];
}

export async function getLoginHistory(): Promise<LoginEntry[]> {
  const { data } = await apiClient.get<LoginEntry[] | { history?: LoginEntry[] }>(SECURITY_ENDPOINTS.LOGIN_HISTORY);
  return Array.isArray(data) ? data : data?.history || [];
}

export async function logoutSession(id: string): Promise<void> {
  await apiClient.post(SECURITY_ENDPOINTS.SESSION_LOGOUT(id));
}

export async function logoutAllSessions(): Promise<void> {
  await apiClient.post(SECURITY_ENDPOINTS.SESSIONS_LOGOUT_ALL);
}

export async function deleteLoginHistoryEntry(id: number): Promise<void> {
  await apiClient.delete(SECURITY_ENDPOINTS.LOGIN_HISTORY_DELETE(id));
}

export async function clearLoginHistory(): Promise<void> {
  await apiClient.delete(SECURITY_ENDPOINTS.LOGIN_HISTORY);
}
