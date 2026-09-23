import type { ComponentType } from 'react';
import type { StepFormProps } from '../../../../../util/types';
import { MarketplaceForm } from './MarketplaceForm';
import { CarsForm } from './CarsForm';
import { RealEstateForm } from './RealEstateForm';
import { MotorcyclesForm } from './MotorcyclesForm';
import { BoatsForm } from './BoatsForm';
import { FarmEquipmentForm } from './FarmEquipmentForm';
import { JobsForm } from './JobsForm';
export const CATEGORY_FORMS: Record<string, ComponentType<Omit<StepFormProps, 'categoryKey'>>> = {
  Marketplace: MarketplaceForm,
  Cars: CarsForm,
  RealEstate: RealEstateForm,
  Motorcycles: MotorcyclesForm,
  Boats: BoatsForm,
  farmequipment: FarmEquipmentForm,
  Jobs: JobsForm,
};
