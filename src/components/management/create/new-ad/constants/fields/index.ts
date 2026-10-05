import type { FieldDefMap, TFn } from '../../../../../../utils/types';
import { getMarketplaceFields } from './marketplace.fields';
import { getCarsFields } from './cars.fields';
import { getRealEstateFields } from './realEstate.fields';
import { getMotorcyclesFields } from './motorcycles.fields';
import { getBoatsFields } from './boats.fields';
import { getFarmEquipmentFields } from './farmEquipment.fields';
import { getJobsFields } from './jobs.fields';

export function getFields(t: TFn): FieldDefMap {
  return {
    Marketplace: getMarketplaceFields(t),
    Cars: getCarsFields(t),
    RealEstate: getRealEstateFields(t),
    Motorcycles: getMotorcyclesFields(t),
    Boats: getBoatsFields(t),
    farmequipment: getFarmEquipmentFields(t),
    Jobs: getJobsFields(t),
  };
}
