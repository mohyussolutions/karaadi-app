import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getJobsFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createJobs.titleLabel'), placeholder: 'e.g. Senior Software Engineer', type: 'text', required: true },
    {
      key: 'jobType', label: t('createJobs.jobTypeLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('subcategories.jobs.fullTime'),   value: 'fullTime' },
        { label: t('subcategories.jobs.partTime'),   value: 'partTime' },
        { label: t('subcategories.jobs.freelance'),  value: 'freelance' },
        { label: t('common.other'),                  value: 'other' },
      ],
    },
    { key: 'companyName', label: t('createJobs.companyLabel'), placeholder: 'e.g. Karaadi Ltd', type: 'text', required: true },
    { key: 'salaryRange', label: t('createJobs.salaryRangeLabel'), placeholder: 'e.g. 500-1500', type: 'text' },
    {
      key: 'experienceLevel', label: t('createJobs.experienceLevelLabel'), type: 'dropdown',
      options: [
        { label: t('subcategories.jobsNested.experienceLevels.entry'),  value: 'entry' },
        { label: t('subcategories.jobsNested.experienceLevels.mid'),    value: 'mid' },
        { label: t('subcategories.jobsNested.experienceLevels.senior'), value: 'senior' },
      ],
    },
    {
      key: 'educationLevel', label: t('createJobs.educationLevelLabel'), type: 'dropdown',
      options: [
        { label: t('subcategories.jobsNested.educationLevels.highschool'), value: 'highschool' },
        { label: t('subcategories.jobsNested.educationLevels.diploma'),    value: 'diploma' },
        { label: t('subcategories.jobsNested.educationLevels.bachelor'),   value: 'bachelor' },
        { label: t('subcategories.jobsNested.educationLevels.master'),     value: 'master' },
      ],
    },
    { key: 'applicationDeadline', label: t('createJobs.applicationDeadlineLabel'), placeholder: 'e.g. 2026-07-31', type: 'text', required: true },
    { key: 'description', label: t('createMarketplace.descriptionLabel'), placeholder: 'Describe the role and responsibilities…', type: 'textarea', required: true },
  ];
}
