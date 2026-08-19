import { apiClient } from '../client';
import { SUPPORT_ENDPOINTS } from '../../api/urls';
import type { Ticket, CreateTicketPayload, AddTicketMessagePayload } from '../../util/types';

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const { data } = await apiClient.post<Ticket>(SUPPORT_ENDPOINTS.TICKETS, payload);
  return data;
}

export async function getTicketHistory(email: string): Promise<Ticket[]> {
  try {
    const { data } = await apiClient.get<Ticket[]>(SUPPORT_ENDPOINTS.TICKETS);
    const list = Array.isArray(data) ? data : [];
    return list
      .filter((t) => t?.senderEmail === email)
      .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0));
  } catch {
    return [];
  }
}

export async function getTicketDetails(ticketId: number): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.get<Ticket>(SUPPORT_ENDPOINTS.TICKET_BY_ID(ticketId));
    return data;
  } catch {
    return null;
  }
}

export async function addTicketMessage(ticketId: number, payload: AddTicketMessagePayload): Promise<boolean> {
  try {
    await apiClient.post(SUPPORT_ENDPOINTS.MESSAGES(ticketId), payload);
    return true;
  } catch {
    return false;
  }
}
