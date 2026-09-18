import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getCarsFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createCars.titleLabel'), placeholder: t('createCars.titlePlaceholder'), type: 'text', required: true },
    {
      key: 'subcategory', label: t('createCars.categoryLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('subcategories.cars.carsForSale'),   value: 'carsForSale' },
        { label: t('subcategories.cars.leaseCars'),     value: 'leaseCars' },
        { label: t('subcategories.cars.trailers'),      value: 'trailers' },
        { label: t('subcategories.cars.carParts'),      value: 'carParts' },
        { label: t('subcategories.cars.truck'),         value: 'truck' },
        { label: t('subcategories.cars.electricCars'),  value: 'electricCars' },
        { label: t('subcategories.cars.buses'),         value: 'buses' },
      ],
    },
    { key: 'make', label: t('createCars.makeLabel'), placeholder: t('createCars.makePlaceholder'), type: 'text', required: true },
    { key: 'model', label: t('createCars.modelLabel'), placeholder: t('createCars.modelPlaceholder'), type: 'text', required: true },
    { key: 'trim', label: t('createCars.trimLabel'), placeholder: t('createCars.trimPlaceholder'), type: 'text' },
    { key: 'year', label: t('createCars.yearLabel'), placeholder: t('createCars.yearPlaceholder'), type: 'number', required: true },
    { key: 'mileage', label: t('createCars.mileageLabel'), placeholder: t('createCars.mileagePlaceholder'), type: 'number' },
    {
      key: 'fuelType', label: t('createCars.fuelTypeLabel'), type: 'dropdown',
      options: [
        { label: t('createCars.fuelTypes.Petrol'),   value: 'Petrol' },
        { label: t('createCars.fuelTypes.Diesel'),   value: 'Diesel' },
        { label: t('createCars.fuelTypes.Hybrid'),   value: 'Hybrid' },
        { label: t('createCars.fuelTypes.Electric'), value: 'Electric' },
        { label: t('createCars.fuelTypes.Other'),    value: 'Other' },
      ],
    },
    {
      key: 'gearbox', label: t('createCars.gearboxLabel'), type: 'dropdown',
      options: [
        { label: t('createCars.gearboxOptions.Manual'),    value: 'Manual' },
        { label: t('createCars.gearboxOptions.Automatic'), value: 'Automatic' },
      ],
    },
    { key: 'engineSize', label: t('createCars.engineSizeLabel'), placeholder: t('createCars.engineSizePlaceholder'), type: 'text' },
    { key: 'doors', label: t('createCars.doorsLabel'), placeholder: t('createCars.doorsPlaceholder'), type: 'number' },
    { key: 'color', label: t('createCars.colorLabel'), placeholder: t('createCars.colorPlaceholder'), type: 'text' },
    {
      key: 'condition', label: t('createCars.conditionLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createCars.conditionOptions.New'),             value: 'New' },
        { label: t('createCars.conditionOptions.Used'),            value: 'Used' },
        { label: t('createCars.conditionOptions.CertifiedPreOwned'), value: 'Certified Pre-Owned' },
      ],
    },
    { key: 'price', label: t('createCars.priceLabel'), placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: t('createCars.descriptionLabel'), placeholder: t('createCars.descriptionPlaceholder'), type: 'textarea', required: true },
    { key: 'website', label: `${t('createCars.tiktokLabel')} (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
  ];
}
