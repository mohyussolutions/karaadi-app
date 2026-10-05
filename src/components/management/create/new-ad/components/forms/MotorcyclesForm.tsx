import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function MotorcyclesForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="Motorcycles" />;
}
