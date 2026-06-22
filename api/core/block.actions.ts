import { apiClient } from '../client';
import { BLOCK_ENDPOINTS } from '../../constants';

export async function blockUser(userId: string): Promise<void> {
  await apiClient.post(BLOCK_ENDPOINTS.BLOCK(userId));
}

export async function unblockUser(userId: string): Promise<void> {
  await apiClient.post(BLOCK_ENDPOINTS.UNBLOCK(userId));
}
