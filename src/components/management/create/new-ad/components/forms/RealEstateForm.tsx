import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function RealEstateForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="RealEstate" />;
}
