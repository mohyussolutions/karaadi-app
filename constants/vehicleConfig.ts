import { CAT_PATHS } from './categories';
import type { VehicleSpecField, VehicleTypeConfig } from '../util/types';

export const VEHICLE_CONFIG: Record<string, VehicleTypeConfig> = {
  cars: {
    label: 'Car Details',
    endpoint: CAT_PATHS.cars,
    fields: [
      { key: 'brand',        label: 'Make' },
      { key: 'make',         label: 'Make' },
      { key: 'model',        label: 'Model' },
      { key: 'vehicleModel', label: 'Model' },
      { key: 'trim',         label: 'Trim' },
      { key: 'year',         label: 'Year' },
      { key: 'mileage',      label: 'Mileage',      format: (v) => `${Number(v).toLocaleString()} km` },
      { key: 'fuelType',     label: 'Fuel Type' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'gearbox',      label: 'Gearbox' },
      { key: 'engineSize',   label: 'Engine Size' },
      { key: 'doors',        label: 'Doors' },
      { key: 'condition',    label: 'Condition' },
      { key: 'color',        label: 'Color' },
      { key: 'type',         label: 'Type' },
    ],
  },
  boats: {
    label: 'Boat Details',
    endpoint: CAT_PATHS.boats,
    fields: [
      { key: 'type',         label: 'Boat Type' },
      { key: 'boatModel',    label: 'Model' },
      { key: 'year',         label: 'Year' },
      { key: 'length',       label: 'Length',       format: (v) => `${v} ft` },
      { key: 'engineHours',  label: 'Engine Hours', format: (v) => `${Number(v).toLocaleString()} hrs` },
      { key: 'hullMaterial', label: 'Hull Material' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'color',        label: 'Color' },
      { key: 'condition',    label: 'Condition' },
    ],
  },
  motorcycles: {
    label: 'Motorcycle Details',
    endpoint: CAT_PATHS.motorcycles,
    fields: [
      { key: 'make',         label: 'Make' },
      { key: 'model',        label: 'Model' },
      { key: 'modelName',    label: 'Model Name' },
      { key: 'type',         label: 'Type' },
      { key: 'year',         label: 'Year' },
      { key: 'engineSize',   label: 'Engine Size' },
      { key: 'engineCc',     label: 'Engine CC' },
      { key: 'mileage',      label: 'Mileage',     format: (v) => `${Number(v).toLocaleString()} km` },
      { key: 'fuelType',     label: 'Fuel Type' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'gearbox',      label: 'Gearbox' },
      { key: 'color',        label: 'Color' },
      { key: 'condition',    label: 'Condition' },
    ],
  },
  farmequipment: {
    label: 'Equipment Details',
    endpoint: CAT_PATHS.farmEquipment,
    fields: [
      { key: 'make',               label: 'Make' },
      { key: 'brand',              label: 'Brand' },
      { key: 'farmequipmentModel', label: 'Model' },
      { key: 'traktortModel',      label: 'Model' },
      { key: 'type',               label: 'Type' },
      { key: 'equipmentType',      label: 'Equipment Type' },
      { key: 'year',               label: 'Year' },
      { key: 'enginePower',        label: 'Engine Power' },
      { key: 'fuelType',           label: 'Fuel Type' },
      { key: 'hoursUsed',          label: 'Hours Used', format: (v) => `${Number(v).toLocaleString()} hrs` },
      { key: 'hours',              label: 'Hours',      format: (v) => `${Number(v).toLocaleString()} hrs` },
      { key: 'condition',          label: 'Condition' },
    ],
  },
  'farm-equipment': {
    label: 'Equipment Details',
    endpoint: CAT_PATHS.farmEquipment,
    fields: [],
  },
  traktor: {
    label: 'Equipment Details',
    endpoint: CAT_PATHS.farmEquipment,
    fields: [],
  },
};

VEHICLE_CONFIG['farm-equipment'].fields = VEHICLE_CONFIG.farmequipment.fields;
VEHICLE_CONFIG.traktor.fields = VEHICLE_CONFIG.farmequipment.fields;

export function getVehicleConfig(category: string): VehicleTypeConfig {
  return VEHICLE_CONFIG[category?.toLowerCase()] ?? VEHICLE_CONFIG.cars;
}

export function buildSpecItems(item: any, fields: VehicleSpecField[]): { label: string; value: string }[] {
  const seen = new Set<string>();
  const result: { label: string; value: string }[] = [];

  for (const field of fields) {
    const raw = item?.[field.key];
    if (raw === undefined || raw === null || raw === '') continue;
    if (seen.has(field.label)) continue;
    seen.add(field.label);
    result.push({
      label: field.label,
      value: field.format ? field.format(raw) : String(raw),
    });
  }
  return result;
}
