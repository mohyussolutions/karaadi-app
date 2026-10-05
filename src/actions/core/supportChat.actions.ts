import { apiClient } from '../client';
import { SUPPORT_CHAT_ENDPOINTS } from '../constants/endpoints';
import type { SupportChatMessage, SupportChatMessageResponse, SupportChatThread } from '../../utils/types';

export async function getSupportThread(): Promise<SupportChatThread> {
  const { data } = await apiClient.get<SupportChatThread>(SUPPORT_CHAT_ENDPOINTS.ME);
  return { conversation: data?.conversation ?? null, messages: data?.messages ?? [] };
}

export async function sendSupportMessage(content: string): Promise<SupportChatMessage> {
  const { data } = await apiClient.post<SupportChatMessageResponse>(SUPPORT_CHAT_ENDPOINTS.MESSAGES, { content });
  return data.message;
}

export async function markSupportRead(): Promise<void> {
  await apiClient.post(SUPPORT_CHAT_ENDPOINTS.READ, {});
}
