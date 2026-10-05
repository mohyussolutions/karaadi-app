import { apiClient } from '../client';
import { REVIEWS_ENDPOINTS } from '../constants/endpoints';
import type { Review, ReviewsResponse } from '../../utils/types';

export async function getReviewsByUser(userId: string, signal?: AbortSignal): Promise<Review[]> {
  const { data } = await apiClient.get<ReviewsResponse>(REVIEWS_ENDPOINTS.BY_USER(userId), { signal });
  return Array.isArray(data) ? data : data?.reviews || [];
}
