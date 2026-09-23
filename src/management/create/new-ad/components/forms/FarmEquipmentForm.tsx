import { StepForm } from '../StepForm/StepForm';
import type { StepFormProps } from '../../../../../util/types';

type FarmEquipmentFormProps = Omit<StepFormProps, 'categoryKey'>;

export function FarmEquipmentForm(props: FarmEquipmentFormProps) {
  return <StepForm {...props} categoryKey="farmequipment" />;
}
