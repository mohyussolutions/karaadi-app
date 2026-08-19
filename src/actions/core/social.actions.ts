import { apiClient } from '../client';
import { SOCIAL_ENDPOINTS } from '../../constants';

export async function getSocialStatus(): Promise<any> {
  const { data } = await apiClient.get(SOCIAL_ENDPOINTS.STATUS);
  return data;
}

export async function postSocialUpdate(payload: Record<string, any>): Promise<any> {
  const { data } = await apiClient.post(SOCIAL_ENDPOINTS.POST, payload);
  return data;
}
