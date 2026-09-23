import * as SecureStore from '../../util/helpers/secureStorage';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../api/urls';
import {
  AUTH_TOKEN_KEY,
  SOCKET_RECONNECT_ATTEMPTS,
  SOCKET_RECONNECT_DELAY_MS,
  SOCKET_RECONNECT_DELAY_MAX_MS,
  SOCKET_RECONNECT_JITTER,
} from '../../constants';

let socket: Socket | null = null;
const pendingReads = new Set<number>();
const pendingJoins = new Set<number>();

function flushPending(): void {
  if (!socket?.connected) return;
  pendingJoins.forEach((id) => socket!.emit('joinChat', id));
  pendingJoins.clear();
  pendingReads.forEach((id) => socket!.emit('markAsRead', { chatId: id }));
  pendingReads.clear();
}

export async function connectSocket(userId: string): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

  socket = io(API_BASE_URL, {
    auth: { userId, token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: SOCKET_RECONNECT_ATTEMPTS,
    reconnectionDelay: SOCKET_RECONNECT_DELAY_MS,
    reconnectionDelayMax: SOCKET_RECONNECT_DELAY_MAX_MS,
    randomizationFactor: SOCKET_RECONNECT_JITTER,
  });
  socket.on('connect', flushPending);

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
  if (socket?.connected) socket.emit('joinChat', chatId);
  else pendingJoins.add(chatId);
}

export function leaveChat(chatId: number): void {
  socket?.emit('leaveChat', chatId);
}

export function emitSendMessage(chatId: number, content: string, tempId?: string): void {
  socket?.emit('sendMessage', { chatId, content, tempId });
}

export function emitMarkAsRead(chatId: number): void {
  if (socket?.connected) socket.emit('markAsRead', { chatId });
  else pendingReads.add(chatId);
}
