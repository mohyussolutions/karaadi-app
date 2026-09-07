import { apiClient } from '../client';
import { REVIEWS_ENDPOINTS } from '../../api/endpoints';
import type { Review, CreateReviewPayload } from '../../util/types/review.types';

export async function getReviewsByUser(userId: string, signal?: AbortSignal): Promise<Review[]> {
  const { data } = await apiClient.get<Review[] | { reviews?: Review[] }>(REVIEWS_ENDPOINTS.BY_USER(userId), { signal });
  return Array.isArray(data) ? data : data?.reviews || [];
}

export async function createReview(payload: CreateReviewPayload): Promise<{ review: Review }> {
  const { data } = await apiClient.post<{ review: Review }>(REVIEWS_ENDPOINTS.CREATE, payload);
  return data;
}
