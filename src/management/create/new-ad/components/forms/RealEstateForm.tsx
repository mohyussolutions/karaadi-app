import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

export type RealEstateFormProps = Omit<StepFormProps, 'categoryKey'>;

export function RealEstateForm(props: RealEstateFormProps) {
  return <StepForm {...props} categoryKey="RealEstate" />;
}
