import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

type CarsFormProps = Omit<StepFormProps, 'categoryKey'>;

export function CarsForm(props: CarsFormProps) {
  return <StepForm {...props} categoryKey="Cars" />;
}
