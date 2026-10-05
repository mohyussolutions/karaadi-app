import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function CarsForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="Cars" />;
}
