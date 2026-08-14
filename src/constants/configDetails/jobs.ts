import { formatDate } from '../../util/helpers';
import type { CategorySpecField, CategoryTypeConfig } from '../../util/types';

export const JOBS_ENDPOINTS = {
  LIST: '/api/jobs',
  BY_ID: (id: string) => `/api/jobs/${id}`,
  CREATE: '/api/jobs',
  UPDATE: (id: string) => `/api/jobs/${id}`,
  DELETE: (id: string) => `/api/jobs/${id}`,
};

const JOBS_SPEC_FIELDS: CategorySpecField[] = [
  { key: 'company', labelKey: 'jobsPage.labelCompany' },
  { key: 'employmentType', labelKey: 'jobsPage.labelJobType' },
  { key: 'type', labelKey: 'jobsPage.labelJobType' },
  { key: 'salary', labelKey: 'jobsPage.labelSalary' },
  { key: 'location', labelKey: 'jobsPage.labelLocation' },
  { key: 'createdAt', labelKey: 'jobsPage.labelPosted', format: (v) => formatDate(v) },
];

export const JOBS_CONFIG: CategoryTypeConfig = {
  label: 'Job Details',
  endpoint: JOBS_ENDPOINTS.LIST,
  fields: JOBS_SPEC_FIELDS,
};

export function getJobsConfig(): CategoryTypeConfig {
  return JOBS_CONFIG;
}
