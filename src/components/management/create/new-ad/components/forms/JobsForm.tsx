import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function JobsForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="Jobs" />;
}
