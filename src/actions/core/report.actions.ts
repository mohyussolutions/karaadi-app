import { apiClient } from '../client';
import { REPORT_ENDPOINTS } from '../../api/urls';
import type { ReportPayload } from '../../util/types/common.types';

export async function createReport(payload: ReportPayload): Promise<void> {
  await apiClient.post(REPORT_ENDPOINTS.CREATE, payload);
}
