import type { IncomingMessage } from '../models/chat.types';
import type { MessageBanner } from '../models/notification.types';
import type { SocketNotificationPayload } from '../models/notification.types';

export type NotificationEvent = [string, (payload: SocketNotificationPayload) => void];

export type MessageBannerCallback = (data: MessageBanner) => void;
export type IncomingMessageHandler = (payload: IncomingMessage) => void;
