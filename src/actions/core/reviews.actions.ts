import { apiClient } from '../client';
import { REVIEWS_ENDPOINTS } from '../../constants';

export async function getReviewsByUser(userId: string): Promise<any[]> {
  const { data } = await apiClient.get(REVIEWS_ENDPOINTS.BY_USER(userId));
  return Array.isArray(data) ? data : data?.reviews || [];
}

export async function createReview(payload: Record<string, any>): Promise<any> {
  const { data } = await apiClient.post(REVIEWS_ENDPOINTS.CREATE, payload);
  return data;
}
