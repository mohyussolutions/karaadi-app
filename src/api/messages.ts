import { apiClient } from './client';
import { MESSAGES_ENDPOINTS } from './urls';
import type { Conversation, Message } from '../types';

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get(MESSAGES_ENDPOINTS.CONVERSATIONS);
  return Array.isArray(data) ? data : data?.conversations || [];
}

export async function getConversation(userId: string): Promise<Message[]> {
  const { data } = await apiClient.get(MESSAGES_ENDPOINTS.CONVERSATION(userId));
  return Array.isArray(data) ? data : data?.messages || [];
}

export async function sendMessage(payload: {
  receiverId: string;
  content: string;
  listingId?: string;
}): Promise<Message> {
  const { data } = await apiClient.post(MESSAGES_ENDPOINTS.SEND, payload);
  return data;
}

export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get(MESSAGES_ENDPOINTS.UNREAD_COUNT);
  return data?.count ?? 0;
}
