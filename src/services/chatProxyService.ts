import type { ChatMessage, Chatroom } from '../utils/types/chat.types';
import { apiClient } from '../api/client';
import { API_BASE_URL } from '../constants/endpoints';

const url = (path: string) => `${API_BASE_URL}${path}`;

const CHAT_PATHS = {
  USER_CHATS: (userId: string) => url(`/api/chats/user/${userId}`),
  CHAT_MESSAGES: (chatId: number, userId: string) =>
    url(`/api/chats/${chatId}/messages?userId=${userId}`),
  CREATE: url('/api/chats/create'),
  DELETE: (chatId: number, userId: string) =>
    url(`/api/chats/${chatId}?userId=${userId}`),
};

const MSG_PATHS = {
  SEND: url('/api/messages/send'),
  DELETE_MESSAGE: (messageId: number) => url(`/api/messages/${messageId}`),
  UPDATE_MESSAGE: (messageId: number) => url(`/api/messages/${messageId}`),
};

function mapChat(chat: any): Chatroom {
  const item =
    chat.item ||
    chat.marketplace ||
    chat.car ||
    chat.boat ||
    chat.motorcycle ||
    chat.realEstate ||
    chat.farmequipment ||
    chat.subscriptions?.[0] ||
    null;
  return {
    chatId: chat.id,
    senderId: chat.senderId,
    senderName: chat.sender?.username || 'User',
    senderAvatar: chat.sender?.profileImage || null,
    receiverId: chat.receiverId,
    receiverName: chat.receiver?.username || 'User',
    receiverAvatar: chat.receiver?.profileImage || null,
    lastMessage: chat.messages?.[0]?.content || null,
    lastMessageAt: chat.messages?.[0]?.timestamp || chat.updatedAt || null,
    unreadCount: chat.unreadCount || 0,
    updatedAt: chat.updatedAt,
    itemTitle: item?.title || null,
    itemImage: item?.images?.[0] || null,
    itemPrice: item?.price || null,
    itemId: (item?._id || item?.id || chat.itemId || null) as string | null,
    itemModel: chat.itemModel || null,
  };
}

function mapMessage(msg: any): ChatMessage {
  return {
    id: msg.id,
    chatId: msg.chatId,
    senderId: msg.senderId,
    senderName: msg.sender?.username || 'User',
    senderAvatar: msg.sender?.profileImage || null,
    content: msg.content,
    timestamp: msg.timestamp || msg.createdAt,
    createdAt: msg.createdAt || msg.timestamp,
    read: msg.read,
    deleted: msg.deleted,
    isEdited: msg.isEdited,
    sender: msg.sender,
  };
}

export async function getUserChatrooms(userId: string): Promise<Chatroom[]> {
  try {
    const res = await apiClient.get(CHAT_PATHS.USER_CHATS(userId));
    const data = res.data;
    return Array.isArray(data) ? data.map(mapChat) : [];
  } catch {
    return [];
  }
}

export async function getChatroomMessages(
  chatId: number,
  userId: string,
  before?: number,
): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  try {
    const endpoint = before
      ? `${CHAT_PATHS.CHAT_MESSAGES(chatId, userId)}&before=${before}`
      : CHAT_PATHS.CHAT_MESSAGES(chatId, userId);
    const res = await apiClient.get(endpoint);
    const data = res.data;
    if (Array.isArray(data)) return { messages: data.map(mapMessage), hasMore: false };
    return {
      messages: (data.messages ?? []).map(mapMessage),
      hasMore: data.hasMore ?? false,
    };
  } catch {
    return { messages: [], hasMore: false };
  }
}

export async function createOrGetChatProxy(data: {
  senderId: string;
  receiverId: string;
  itemId: string;
  itemModel: string;
}): Promise<Chatroom> {
  const res = await apiClient.post(CHAT_PATHS.CREATE, data);
  return mapChat(res.data.chat ?? res.data);
}

export async function sendChatMessage(data: {
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<ChatMessage | null> {
  try {
    const res = await apiClient.post(MSG_PATHS.SEND, {
      chatId: String(data.chatId),
      senderId: String(data.senderId),
      receiverId: String(data.receiverId),
      content: data.content,
    });
    return mapMessage(res.data);
  } catch {
    return null;
  }
}

export async function deleteChatroomProxy(
  chatId: number,
  userId: string,
): Promise<boolean> {
  try {
    await apiClient.delete(CHAT_PATHS.DELETE(chatId, userId));
    return true;
  } catch {
    return false;
  }
}

export async function deleteChatMessageProxy(
  messageId: number,
  userId: string,
): Promise<boolean> {
  try {
    await apiClient.delete(`${MSG_PATHS.DELETE_MESSAGE(messageId)}?userId=${userId}`);
    return true;
  } catch {
    return false;
  }
}

export async function updateChatMessageProxy(
  messageId: number,
  content: string,
  userId: string,
): Promise<ChatMessage | null> {
  try {
    const res = await apiClient.put(MSG_PATHS.UPDATE_MESSAGE(messageId), {
      content,
      userId,
    });
    return mapMessage(res.data);
  } catch {
    return null;
  }
}
