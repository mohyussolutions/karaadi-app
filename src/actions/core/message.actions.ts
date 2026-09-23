import { apiClient } from '../client';
import { CHATS_ENDPOINTS, MESSAGES_ENDPOINTS } from '../../api/endpoints';
import type { Chat, ChatMessage } from '../../util/types';

export async function getMyChats(userId: string): Promise<Chat[]> {
  const { data } = await apiClient.get(CHATS_ENDPOINTS.MY_CHATS(userId));
  return Array.isArray(data) ? data : [];
}

export async function createOrFindChat(payload: {
  senderId: string;
  receiverId: string;
  itemId: string;
  itemModel: string;
}): Promise<{ chat: Chat; isNew: boolean }> {
  const { data } = await apiClient.post(CHATS_ENDPOINTS.CREATE, payload);
  return data;
}

export async function getChatMessages(chatId: number, userId: string): Promise<ChatMessage[]> {
  const { data } = await apiClient.get(CHATS_ENDPOINTS.MESSAGES(chatId), {
    params: { userId },
  });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  return [];
}

export async function sendMessage(payload: {
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
}): Promise<ChatMessage> {
  const { data } = await apiClient.post(MESSAGES_ENDPOINTS.SEND, {
    ...payload,
    chatId: String(payload.chatId),
  });
  return data;
}

export async function markChatRead(chatId: number): Promise<void> {
  await apiClient.patch(CHATS_ENDPOINTS.READ(chatId));
}
