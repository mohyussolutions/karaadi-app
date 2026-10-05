import { apiClient } from '../client';
import { SOCIAL_ENDPOINTS } from '../constants/endpoints';
import type { SocialStatus, SocialPostUpdatePayload, SocialPostUpdateResponse } from '../../utils/types';

export async function getSocialStatus(): Promise<SocialStatus> {
  const { data } = await apiClient.get<SocialStatus>(SOCIAL_ENDPOINTS.STATUS);
  return data;
}

export async function postSocialUpdate(payload: SocialPostUpdatePayload): Promise<SocialPostUpdateResponse> {
  const { data } = await apiClient.post<SocialPostUpdateResponse>(SOCIAL_ENDPOINTS.POST, payload);
  return data;
}
