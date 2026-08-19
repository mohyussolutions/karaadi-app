import { apiClient } from '../client';
import { REPORT_ENDPOINTS } from '../../constants';
import type { ReportPayload } from '../../util/types/api.types';

export async function createReport(payload: ReportPayload): Promise<void> {
  await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
}
