import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

type JobsFormProps = Omit<StepFormProps, 'categoryKey'>;

export function JobsForm(props: JobsFormProps) {
  return <StepForm {...props} categoryKey="Jobs" />;
}
