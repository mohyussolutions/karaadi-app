import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';
import { getMarketplaceFields } from './marketplace.fields';
import { getCarsFields } from './cars.fields';
import { getRealEstateFields } from './realEstate.fields';
import { getMotorcyclesFields } from './motorcycles.fields';
import { getBoatsFields } from './boats.fields';
import { getFarmEquipmentFields } from './farmEquipment.fields';
import { getJobsFields } from './jobs.fields';

export function getFields(t: TFn): Record<string, FieldDef[]> {
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

export const NUMERIC_KEYS = [
  'price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'sizeSqm',
  'hoursUsed', 'floor', 'totalFloors', 'doors',
];

export const BOOLEAN_KEYS = ['furnished', 'parking', 'hasGarage', 'hasGarden'];
