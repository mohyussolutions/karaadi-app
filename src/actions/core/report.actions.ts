import { apiClient } from '../client';
import { REPORT_ENDPOINTS } from '../constants/endpoints';
import type { ReportPayload } from '../../utils/types';

export async function createReport(payload: ReportPayload): Promise<void> {
  await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
}
