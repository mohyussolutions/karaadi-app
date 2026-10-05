
import type { CategoryFormMap } from '../../../../../../utils/types';
import { MarketplaceForm } from './MarketplaceForm';
import { CarsForm } from './CarsForm';
import { RealEstateForm } from './RealEstateForm';
import { MotorcyclesForm } from './MotorcyclesForm';
import { BoatsForm } from './BoatsForm';
import { FarmEquipmentForm } from './FarmEquipmentForm';
import { JobsForm } from './JobsForm';
export const CATEGORY_FORMS: CategoryFormMap = {
  Marketplace: MarketplaceForm,
  Cars: CarsForm,
  RealEstate: RealEstateForm,
  Motorcycles: MotorcyclesForm,
  Boats: BoatsForm,
  farmequipment: FarmEquipmentForm,
  Jobs: JobsForm,
};
