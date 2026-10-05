import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function BoatsForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="Boats" />;
}
