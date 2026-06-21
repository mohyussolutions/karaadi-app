import { apiClient } from '../client';
import { BUSINESSES_ENDPOINTS } from '../../constants';

export async function getBusinessById(id: string): Promise<any> {
  const { data } = await apiClient.get(BUSINESSES_ENDPOINTS.BY_ID(id));
  return data;
}

export async function getMyBusinesses(): Promise<any[]> {
  const { data } = await apiClient.get(BUSINESSES_ENDPOINTS.MY);
  return data;
}

export async function createBusiness(payload: Record<string, any>): Promise<any> {
  const { data } = await apiClient.post(BUSINESSES_ENDPOINTS.CREATE, payload);
  return data;
}

export async function updateBusiness(id: string, payload: Record<string, any>): Promise<void> {
  await apiClient.patch(BUSINESSES_ENDPOINTS.UPDATE(id), payload);
}
