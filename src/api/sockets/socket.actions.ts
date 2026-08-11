import * as SecureStore from '../../util/secureStorage';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../constants';
import { AUTH_TOKEN_KEY } from '../client.constants';

let socket: Socket | null = null;

export async function connectSocket(userId: string): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

  socket = io(API_BASE_URL, {
    auth: { userId, token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function joinChat(chatId: number): void {
  socket?.emit('joinChat', chatId);
}

export function leaveChat(chatId: number): void {
  socket?.emit('leaveChat', chatId);
}

export function emitSendMessage(chatId: number, content: string, tempId?: string): void {
  socket?.emit('sendMessage', { chatId, content, tempId });
}

export function emitMarkAsRead(chatId: number): void {
  socket?.emit('markAsRead', { chatId });
}
