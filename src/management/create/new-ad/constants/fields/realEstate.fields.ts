import type { FieldDef, TFn } from '../../../../../util/types/new-ad.types';

export function getRealEstateFields(t: TFn): FieldDef[] {
  return [
    { key: 'title', label: t('createRealEstate.titleLabel'), placeholder: t('createRealEstate.titleInputPlaceholder'), type: 'text', required: true },
    {
      key: 'subcategory', label: t('createRealEstate.subcategoryLabel'), type: 'dropdown', required: true,
      options: [
        { label: t('createRealEstate.categories.forRent'),     value: 'forRent' },
        { label: t('createRealEstate.categories.forSale'),     value: 'forSale' },
        { label: t('createRealEstate.categories.landForSale'), value: 'landForSale' },
        { label: t('createRealEstate.categories.farmForSale'), value: 'farmForSale' },
        { label: t('createRealEstate.categories.commercial'),  value: 'commercial' },
      ],
    },
    {
      key: 'propertyType', label: t('createRealEstate.propertyTypeLabel'), type: 'dropdown',
      options: [
        { label: t('createRealEstate.propertyTypes.apartment'),       value: 'apartment' },
        { label: t('createRealEstate.propertyTypes.houseVilla'),      value: 'houseVilla' },
        { label: t('createRealEstate.propertyTypes.commercialSpace'), value: 'commercialSpace' },
        { label: t('createRealEstate.propertyTypes.warehouse'),       value: 'warehouse' },
        { label: t('createRealEstate.propertyTypes.land'),            value: 'land' },
        { label: t('createRealEstate.propertyTypes.farm'),            value: 'farm' },
        { label: t('createRealEstate.propertyTypes.other'),           value: 'other' },
      ],
    },
    { key: 'bedrooms', label: t('createRealEstate.bedroomsLabel'), placeholder: t('createRealEstate.bedroomsPlaceholder'), type: 'number' },
    { key: 'bathrooms', label: t('createRealEstate.bathroomsLabel'), placeholder: t('createRealEstate.bathroomsPlaceholder'), type: 'number' },
    { key: 'sizeSqm', label: t('createRealEstate.sizeSqmLabel'), placeholder: t('createRealEstate.sizeSqmPlaceholder'), type: 'number' },
    { key: 'floor', label: t('createRealEstate.floorLabel'), placeholder: t('createRealEstate.floorPlaceholder'), type: 'number' },
    { key: 'totalFloors', label: t('createRealEstate.totalFloorsLabel'), placeholder: t('createRealEstate.totalFloorsPlaceholder'), type: 'number' },
    {
      key: 'furnished', label: t('createRealEstate.furnishedLabel'), type: 'dropdown',
      options: [{ label: t('common.yes'), value: 'Yes' }, { label: t('common.no'), value: 'No' }],
    },
    {
      key: 'parking', label: t('createRealEstate.parkingLabel'), type: 'dropdown',
      options: [{ label: t('common.yes'), value: 'Yes' }, { label: t('common.no'), value: 'No' }],
    },
    {
      key: 'hasGarage', label: t('createRealEstate.garageLabel'), type: 'dropdown',
      options: [{ label: t('common.yes'), value: 'Yes' }, { label: t('common.no'), value: 'No' }],
    },
    {
      key: 'hasGarden', label: t('createRealEstate.gardenLabel'), type: 'dropdown',
      options: [{ label: t('common.yes'), value: 'Yes' }, { label: t('common.no'), value: 'No' }],
    },
    {
      key: 'amenities', label: t('createRealEstate.amenitiesLabel'), type: 'multiselect',
      options: [
        { label: t('createRealEstate.swimmingPoolLabel'), value: 'Swimming Pool' },
        { label: t('createRealEstate.gymLabel'), value: 'Gym' },
        { label: t('createRealEstate.securityLabel'), value: 'Security' },
        { label: t('createRealEstate.elevatorLabel'), value: 'Elevator' },
        { label: t('createRealEstate.generatorLabel'), value: 'Generator' },
        { label: t('createRealEstate.waterSupplyLabel'), value: 'Water Supply' },
        { label: t('createRealEstate.airConditioningLabel'), value: 'Air Conditioning' },
        { label: t('createRealEstate.gardenLabel'), value: 'Garden' },
        { label: t('createRealEstate.balconyLabel'), value: 'Balcony' },
        { label: t('createRealEstate.parkingLabel'), value: 'Parking' },
      ],
    },
    { key: 'address', label: t('createRealEstate.addressLabel'), placeholder: 'Street / area (optional)', type: 'text' },
    { key: 'price', label: t('createRealEstate.priceLabel'), placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: t('createRealEstate.descriptionLabel'), placeholder: t('createRealEstate.descriptionPlaceholder', { defaultValue: 'Describe the property…' }), type: 'textarea', required: true },
    { key: 'website', label: `Website (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
  ];
}
