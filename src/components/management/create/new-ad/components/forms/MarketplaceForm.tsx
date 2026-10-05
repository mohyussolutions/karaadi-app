import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function MarketplaceForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="Marketplace" />;
}
