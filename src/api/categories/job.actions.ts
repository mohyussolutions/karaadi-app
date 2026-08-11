import { apiClient } from '../client';
import { JOBS_ENDPOINTS } from '../../constants';

export interface CreateJobData {
  title: string;
  description: string;
  company?: string;
  location?: string;
  salary?: number;
  employmentType?: string;
  experienceLevel?: string;
  city: string;
  region: string;
  type?: string;
  isPaid?: boolean;
}

function normJob(item: any) {
  const id = String(item._id ?? item.id ?? '');
  return {
    ...item,
    _id: id,
    id,
    title:     String(item.title || ''),
    company:   String(item.company || ''),
    salary:    Number(item.salary) || 0,
    location:  item.location || [item.city, item.region].filter(Boolean).join(', '),
    type:      item.type || item.employmentType || 'Full-time',
    isPaid:    item.isPaid ?? true,
  };
}

export async function getJobs(params?: Record<string, any>) {
  try {
    const { data } = await apiClient.get(JOBS_ENDPOINTS.LIST, { params });
    const list = Array.isArray(data) ? data : data?.jobs ?? data?.data ?? [];
    return list.map(normJob);
  } catch { return []; }
}

export async function getJobById(id: string) {
  try {
    const { data } = await apiClient.get(JOBS_ENDPOINTS.BY_ID(id));
    if (!data) return null;
    const item = Array.isArray(data) ? data[0] : data;
    return item ? normJob(item) : null;
  } catch { return null; }
}

export async function createJob(body: CreateJobData) {
  try {
    const { data } = await apiClient.post(JOBS_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id, data };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to create job listing' };
  }
}

export async function updateJob(id: string, body: Partial<CreateJobData>) {
  try {
    const { data } = await apiClient.put(JOBS_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id, data };
  } catch (e: any) {
    return { success: false, message: e?.response?.data?.message || 'Failed to update job listing' };
  }
}

export async function deleteJob(id: string) {
  try {
    await apiClient.delete(JOBS_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false, message: 'Failed to delete job' }; }
}
