import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

export type MarketplaceFormProps = Omit<StepFormProps, 'categoryKey'>;

export function MarketplaceForm(props: MarketplaceFormProps) {
  return <StepForm {...props} categoryKey="Marketplace" />;
}
