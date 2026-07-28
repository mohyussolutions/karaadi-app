export type SupportRole = 'USER' | 'SUPPORT_MANAGER' | 'ADMIN';
export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'RESOLVED' | 'CLOSED';

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderRole: SupportRole;
  senderName: string;
  senderEmail: string;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  status: TicketStatus;
  priority: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  messages?: TicketMessage[];
}

export interface CreateTicketPayload {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
}

export interface AddTicketMessagePayload {
  senderName: string;
  senderEmail: string;
  body: string;
  senderRole?: SupportRole;
}
