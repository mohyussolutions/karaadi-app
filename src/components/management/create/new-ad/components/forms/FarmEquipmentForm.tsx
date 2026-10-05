import { StepForm } from '../StepForm/StepForm';
import type { CategoryFormProps } from '../../../../../../utils/types';

export function FarmEquipmentForm(props: CategoryFormProps) {
  return <StepForm {...props} categoryKey="farmequipment" />;
}
