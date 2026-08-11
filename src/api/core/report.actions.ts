import { apiClient } from '../client';
import { REPORT_ENDPOINTS } from '../../constants';

interface ReportPayload {
  userId: string;
  itemId: string;
  itemType: string;
  reason: string;
  description?: string;
}

export async function createReport(payload: ReportPayload): Promise<void> {
  await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
}
