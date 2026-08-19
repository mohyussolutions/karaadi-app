import { apiClient } from '../client';
import { IDENTIFICATION_ENDPOINTS } from '../../constants';
import type {
  IdentificationStatus,
  IdentificationSubmitPayload,
  IdentificationSubmitResponse,
} from '../../util/types';

export async function getIdentificationStatus(): Promise<IdentificationStatus> {
  const { data } = await apiClient.get<IdentificationStatus>(IDENTIFICATION_ENDPOINTS.STATUS);
  return data;
}

export async function submitIdentification(
  payload: IdentificationSubmitPayload,
): Promise<IdentificationSubmitResponse> {
  const { data } = await apiClient.post<IdentificationSubmitResponse>(
    IDENTIFICATION_ENDPOINTS.SUBMIT,
    payload,
  );
  return data;
}
