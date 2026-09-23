import { apiClient } from '../client';
import { BLOCK_ENDPOINTS } from '../../api/endpoints';

export async function blockUser(userId: string): Promise<void> {
  await apiClient.post(BLOCK_ENDPOINTS.BLOCK(userId));
}
