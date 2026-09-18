import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getMotorcyclesFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createMotorcycle.titleLabel'), placeholder: t('createMotorcycle.titlePlaceholder', { defaultValue: 'e.g. Honda CB500 2021' }), type: 'text', required: true },
    {
      key: 'subcategory', label: t('createMotorcycle.categoryLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createMotorcycle.categories.forSale'), value: 'forSale' },
        { label: t('createMotorcycle.categories.forRent'), value: 'forRent' },
        { label: t('createMotorcycle.categories.parts'),   value: 'spareParts' },
        { label: t('createMotorcycle.categories.other'),   value: 'other' },
      ],
    },
    { key: 'make', label: t('createMotorcycle.makeLabel'), placeholder: t('createMotorcycle.makePlaceholder'), type: 'text', required: true },
    { key: 'model', label: t('createMotorcycle.modelLabel'), placeholder: t('createMotorcycle.modelPlaceholder'), type: 'text', required: true },
    { key: 'year', label: t('createMotorcycle.yearLabel'), placeholder: t('createMotorcycle.yearPlaceholder'), type: 'number', required: true },
    { key: 'engineCc', label: t('createMotorcycle.engineCcLabel'), placeholder: t('createMotorcycle.engineCcPlaceholder'), type: 'number' },
    { key: 'mileage', label: t('createMotorcycle.mileageLabel'), placeholder: t('createMotorcycle.mileagePlaceholder'), type: 'number' },
    {
      key: 'fuelType', label: t('createMotorcycle.fuelTypeLabel'), type: 'dropdown',
      options: [
        { label: t('createMotorcycle.fuelTypes.petrol'),   value: 'petrol' },
        { label: t('createMotorcycle.fuelTypes.electric'), value: 'electric' },
        { label: t('createMotorcycle.fuelTypes.other'),    value: 'other' },
      ],
    },
    {
      key: 'gearbox', label: t('createMotorcycle.gearboxLabel'), type: 'dropdown',
      options: [
        { label: t('createMotorcycle.gearboxOptions.manual'),        value: 'manual' },
        { label: t('createMotorcycle.gearboxOptions.automatic'),     value: 'automatic' },
        { label: t('createMotorcycle.gearboxOptions.semiAutomatic'), value: 'semiAutomatic' },
      ],
    },
    { key: 'color', label: t('createMotorcycle.colorLabel'), placeholder: t('createMotorcycle.colorPlaceholder'), type: 'text' },
    {
      key: 'condition', label: t('createMotorcycle.conditionLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createMotorcycle.conditions.new'),  value: 'new' },
        { label: t('createMotorcycle.conditions.used'), value: 'used' },
      ],
    },
    { key: 'price', label: t('createMotorcycle.priceLabel'), placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: t('createMotorcycle.descriptionLabel'), placeholder: t('createMotorcycle.descriptionPlaceholder'), type: 'textarea', required: true },
    { key: 'website', label: `Website (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
  ];
}
