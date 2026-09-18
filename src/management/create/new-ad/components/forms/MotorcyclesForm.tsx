import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

export type MotorcyclesFormProps = Omit<StepFormProps, 'categoryKey'>;

export function MotorcyclesForm(props: MotorcyclesFormProps) {
  return <StepForm {...props} categoryKey="Motorcycles" />;
}
