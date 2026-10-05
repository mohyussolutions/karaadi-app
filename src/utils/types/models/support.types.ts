export type SupportRole = 'USER' | 'SUPPORT_MANAGER' | 'ADMIN';

export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'RESOLVED' | 'CLOSED';

export interface SenderInfo {
  senderName: string;
  senderEmail: string;
}

export interface TicketMessage extends SenderInfo {
  id: number;
  ticketId: number;
  senderRole: SupportRole;
  body: string;
  createdAt: string;
}

export interface Ticket extends SenderInfo {
  id: number;
  subject: string;
  body: string;
  status: TicketStatus;
  priority: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  messages?: TicketMessage[];
}

export interface CreateTicketPayload extends SenderInfo {
  subject: string;
  body: string;
}

export interface AddTicketMessagePayload extends SenderInfo {
  body: string;
  senderRole?: SupportRole;
}

export type SupportChatRole = 'USER' | 'ADMIN' | 'ASSISTANT';

export interface SupportChatMessage {
  id: string;
  senderRole: SupportChatRole;
  content: string;
  createdAt: string;
}

export interface SupportChatThread {
  conversation: { userUnread?: number } | null;
  messages: SupportChatMessage[];
}
