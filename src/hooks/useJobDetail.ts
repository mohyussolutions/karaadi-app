import { getJobById } from '../actions/categories/job.actions';
import { formatPrice } from '../util/helpers';
import { useListingDetail } from './useListingDetail';
import type { Job } from '../util/types/listing.types';

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Negotiable';
  if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min) return `From ${formatPrice(min)}`;
  return `Up to ${formatPrice(max!)}`;
}

export function useJobDetail(id: string) {
  return useListingDetail<Job>(id, {
    fetchItem: getJobById,
    categoryHint: 'jobs',
    contactRole: 'Employer',
  });
}
