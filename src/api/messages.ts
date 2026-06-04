import { apiClient } from './client';
import { CHATS_ENDPOINTS, MESSAGES_ENDPOINTS } from '../constants/endpoints';
import type { Chat, ChatMessage } from '../utils/types';

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

export async function findConversation(senderId: string, receiverId: string): Promise<Chat | null> {
  try {
    const { data } = await apiClient.get(CHATS_ENDPOINTS.FIND, {
      params: { senderId, receiverId },
    });
    return data;
  } catch {
    return null;
  }
}

export async function getChatMessages(chatId: number, userId: string): Promise<ChatMessage[]> {
  const { data } = await apiClient.get(CHATS_ENDPOINTS.MESSAGES(chatId), {
    params: { userId },
  });
  return Array.isArray(data) ? data : [];
}

export async function sendMessage(payload: {
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
}): Promise<ChatMessage> {
  const { data } = await apiClient.post(MESSAGES_ENDPOINTS.SEND, payload);
  return data;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { data } = await apiClient.get(MESSAGES_ENDPOINTS.UNREAD_COUNT(userId));
  return data?.count ?? 0;
}
