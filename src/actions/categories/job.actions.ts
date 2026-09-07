import { apiClient } from '../client';
import { JOBS_ENDPOINTS } from '../../api/urls';
import type { RawItem, Params } from '../../util/types/common.types';
import type { ApiError } from '../../util/types/generic.types';
import type { CreateJobData, Job } from '../../util/types/listing.types';

export type { CreateJobData };

function normJob<T>(item: RawItem): T {
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
  } as T;
}

export async function getJobs(params?: Params, signal?: AbortSignal): Promise<Job[]> {
  try {
    const { data } = await apiClient.get<RawItem[] | { jobs?: RawItem[]; data?: RawItem[] }>(JOBS_ENDPOINTS.LIST, { params, signal });
    const list = Array.isArray(data) ? data : data?.jobs ?? data?.data ?? [];
    return list.map((item) => normJob<Job>(item));
  } catch { return []; }
}

export async function getJobById(id: string, signal?: AbortSignal): Promise<Job | null> {
  try {
    const { data } = await apiClient.get<RawItem | RawItem[]>(JOBS_ENDPOINTS.BY_ID(id), { signal });
    if (!data) return null;
    const item = Array.isArray(data) ? data[0] : data;
    return item ? normJob<Job>(item) : null;
  } catch { return null; }
}

export async function createJob(body: CreateJobData) {
  try {
    const { data } = await apiClient.post<{ _id?: string; id?: string }>(JOBS_ENDPOINTS.CREATE, body);
    return { success: true, id: data?._id || data?.id, data };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to create job listing' };
  }
}

export async function updateJob(id: string, body: Partial<CreateJobData>) {
  try {
    const { data } = await apiClient.put<{ _id?: string; id?: string }>(JOBS_ENDPOINTS.UPDATE(id), body);
    return { success: true, id: data?._id || data?.id || id, data };
  } catch (e) {
    return { success: false, message: (e as ApiError)?.response?.data?.message || 'Failed to update job listing' };
  }
}

export async function deleteJob(id: string) {
  try {
    await apiClient.delete(JOBS_ENDPOINTS.DELETE(id));
    return { success: true };
  } catch { return { success: false, message: 'Failed to delete job' }; }
}
