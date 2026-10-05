import { CHAT_ITEM_MODELS, DEFAULT_CHAT_ITEM_MODEL } from '../../../actions/constants';
import type { ChatMessage } from '../../../utils/types';

export function toChatItemModel(category?: string): string {
  return CHAT_ITEM_MODELS[(category ?? '').toLowerCase()] ?? DEFAULT_CHAT_ITEM_MODEL;
}

export function parseChatIds(chatIdParam?: string): number[] {
  return (chatIdParam ?? '')
    .split(',')
    .map((value) => parseInt(value, 10))
    .filter((chatId) => Number.isFinite(chatId) && chatId > 0);
}

function messageTime(message: ChatMessage): number {
  return new Date(message.timestamp || message.createdAt || 0).getTime();
}

export function sortMessagesByTime(messageLists: ChatMessage[][]): ChatMessage[] {
  return messageLists.flat().sort((first, second) => messageTime(first) - messageTime(second));
}

export function mergeIncomingMessage(current: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  if (current.some((message) => message.id === incoming.id)) return current;
  const pendingIndex = current.findIndex((message) => {
    if (!message.tempId) return false;
    return incoming.tempId ? message.tempId === incoming.tempId : message.content === incoming.content;
  });
  if (pendingIndex === -1) return [...current, incoming];
  const merged = [...current];
  merged[pendingIndex] = { ...incoming, tempId: current[pendingIndex].tempId };
  return merged;
}

export function buildPendingMessage(chatId: number, senderId: string, content: string): ChatMessage {
  const tempId = `temp_${Date.now()}`;
  return { id: tempId, tempId, chatId, senderId, content, timestamp: new Date().toISOString(), read: false };
}
