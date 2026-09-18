import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getBoatsFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createBoats.titlePlaceholder', { defaultValue: 'Title' }), placeholder: 'e.g. Fishing Boat 2019', type: 'text', required: true },
    {
      key: 'subcategory', label: t('createBoats.subcategory'), type: 'dropdown', required: true,
      options: [
        { label: t('subcategories.boats.boatsForSale'),        value: 'boatsForSale' },
        { label: t('subcategories.boats.boatsForRent'),        value: 'boatsForRent' },
        { label: t('subcategories.boats.boatEnginesForSale'),  value: 'boatEnginesForSale' },
        { label: t('subcategories.boats.boatParts'),           value: 'boatParts' },
      ],
    },
    { key: 'type', label: t('createBoats.typePlaceholder', { defaultValue: 'Boat Type' }), placeholder: 'e.g. Fishing / Yacht', type: 'text', required: true },
    { key: 'boatModel', label: t('createBoats.modelPlaceholder', { defaultValue: 'Model' }), placeholder: 'e.g. F40', type: 'text', required: true },
    {
      key: 'transmission', label: t('createBoats.gearboxPlaceholder', { defaultValue: 'Transmission' }), type: 'dropdown',
      options: [
        { label: t('createCars.gearboxOptions.Manual'),    value: 'Manual' },
        { label: t('createCars.gearboxOptions.Automatic'), value: 'Automatic' },
      ],
    },
    { key: 'color', label: t('createBoats.colorPlaceholder', { defaultValue: 'Color' }), placeholder: 'e.g. Blue', type: 'text', required: true },
    { key: 'price', label: t('createBoats.pricePlaceholder', { defaultValue: 'Price ($)' }), placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: t('createBoats.descriptionPlaceholder', { defaultValue: 'Description' }), placeholder: 'Describe the boat…', type: 'textarea', required: true },
    { key: 'website', label: `Website (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
  ];
}
