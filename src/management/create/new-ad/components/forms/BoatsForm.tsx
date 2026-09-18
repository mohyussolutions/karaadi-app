import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

export type BoatsFormProps = Omit<StepFormProps, 'categoryKey'>;

export function BoatsForm(props: BoatsFormProps) {
  return <StepForm {...props} categoryKey="Boats" />;
}
