import { apiClient } from '../client';
import { JOBS_ENDPOINTS } from '../../api/endpoints';
import { isAbortError } from '../../util/helpers/api.format';
import type { RawItem } from '../../util/types/common.types';
import type { Job } from '../../util/types/listing.types';

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

export async function getJobById(id: string, signal?: AbortSignal): Promise<Job | null> {
  try {
    const { data } = await apiClient.get<RawItem | RawItem[]>(JOBS_ENDPOINTS.BY_ID(id), { signal });
    if (!data) return null;
    const item = Array.isArray(data) ? data[0] : data;
    return item ? normJob<Job>(item) : null;
  } catch (err) {
    if (!isAbortError(err)) console.warn(`[getJobById] failed for id ${id}:`, err);
    return null;
  }
}
