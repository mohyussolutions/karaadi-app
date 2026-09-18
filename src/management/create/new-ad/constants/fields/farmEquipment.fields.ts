import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getFarmEquipmentFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createFarmequipment.titleLabel'), placeholder: t('createFarmequipment.titlePlaceholder'), type: 'text', required: true },
    {
      key: 'subcategory', label: t('createFarmequipment.categoryLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createFarmequipment.categories.tractorForSale'),     value: 'tractor' },
        { label: t('createFarmequipment.categories.farmTools'),          value: 'tools' },
        { label: t('createFarmequipment.categories.fertilizerSpreader'), value: 'fertilizerSpreader' },
        { label: t('createFarmequipment.categories.grainHarvester'),     value: 'harvester' },
        { label: t('createFarmequipment.categories.plow'),               value: 'plow' },
        { label: t('createFarmequipment.categories.irrigationSystem'),   value: 'irrigation' },
      ],
    },
    { key: 'brand', label: t('createFarmequipment.brandLabel'), placeholder: t('createFarmequipment.brandPlaceholder'), type: 'text', required: true },
    { key: 'equipmentType', label: t('createFarmequipment.equipmentTypeLabel'), placeholder: t('createFarmequipment.equipmentTypePlaceholder'), type: 'text' },
    { key: 'year', label: t('createFarmequipment.yearLabel'), placeholder: t('createFarmequipment.yearPlaceholder'), type: 'number' },
    { key: 'hoursUsed', label: t('createFarmequipment.hoursUsedLabel'), placeholder: t('createFarmequipment.hoursUsedPlaceholder'), type: 'number' },
    {
      key: 'condition', label: t('createFarmequipment.conditionLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createFarmequipment.conditions.new'),        value: 'new' },
        { label: t('createFarmequipment.conditions.used'),       value: 'used' },
        { label: t('createFarmequipment.conditions.refurbished'), value: 'refurbished' },
      ],
    },
    { key: 'attachmentsIncluded', label: t('createFarmequipment.attachmentsLabel'), placeholder: t('createFarmequipment.attachmentsPlaceholder'), type: 'text' },
    { key: 'price', label: t('createFarmequipment.priceLabel'), placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: t('createFarmequipment.descriptionLabel'), placeholder: t('createFarmequipment.descriptionPlaceholder'), type: 'textarea', required: true },
    { key: 'website', label: `Website (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
  ];
}
