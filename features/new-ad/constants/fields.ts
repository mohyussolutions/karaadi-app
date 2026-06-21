import type { FieldDef } from '../../../util/types/new-ad.types';

type TFn = (key: string, opts?: Record<string, unknown>) => string;

export function getFields(t: TFn): Record<string, FieldDef[]> {
  return {
    Marketplace: [
      { key: 'title', label: t('createMarketplace.titleLabel'), placeholder: t('createMarketplace.titlePlaceholder'), type: 'text', required: true },
      {
        key: 'subcategory', label: t('createAd.selectCategory'), type: 'dropdown', required: true,
        options: [
          { label: t('subcategories.marketplace.antiques'),       value: 'antiques' },
          { label: t('subcategories.marketplace.electronics'),    value: 'electronics' },
          { label: t('subcategories.marketplace.animalAndSupplies'), value: 'animalAndSupplies' },
          { label: t('subcategories.marketplace.sportsAndOutdoors'), value: 'sportsAndOutdoors' },
          { label: t('subcategories.marketplace.furniture'),      value: 'furniture' },
          { label: t('subcategories.marketplace.fashion'),        value: 'fashion' },
          { label: t('subcategories.marketplace.education', { defaultValue: 'Education' }), value: 'education' },
        ],
      },
      {
        key: 'condition', label: t('createMarketplace.conditionLabel'), type: 'dropdown',
        options: [
          { label: t('createMarketplace.conditions.new'),       value: 'New' },
          { label: t('createMarketplace.conditions.usedLikeNew'), value: 'Used – Like New' },
          { label: t('createMarketplace.conditions.usedGood'),  value: 'Used – Good' },
          { label: t('createMarketplace.conditions.usedFair'),  value: 'Used – Fair' },
        ],
      },
      { key: 'price', label: t('createMarketplace.priceLabel'), placeholder: t('postAd.free', { defaultValue: '0 = price on request' }), type: 'number' },
      { key: 'description', label: t('createMarketplace.descriptionLabel'), placeholder: t('createMarketplace.descriptionPlaceholder'), type: 'textarea', required: true },
      { key: 'website', label: `${t('createMarketplace.websiteLabel')} (${t('createMarketplace.optional')})`, placeholder: 'https://…', type: 'text' },
    ],

    Cars: [
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
      { key: 'year', label: t('createCars.yearLabel'), placeholder: t('createCars.yearPlaceholder'), type: 'number' },
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
    ],

    RealEstate: [
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
        options: [{ label: t('common.continue', { defaultValue: 'Yes' }), value: 'Yes' }, { label: 'No', value: 'No' }],
      },
      {
        key: 'parking', label: t('createRealEstate.parkingLabel'), type: 'dropdown',
        options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }],
      },
      {
        key: 'hasGarage', label: t('createRealEstate.garageLabel'), type: 'dropdown',
        options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }],
      },
      {
        key: 'hasGarden', label: t('createRealEstate.gardenLabel'), type: 'dropdown',
        options: [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }],
      },
      { key: 'address', label: t('createRealEstate.addressLabel'), placeholder: 'Street / area (optional)', type: 'text' },
      { key: 'price', label: t('createRealEstate.priceLabel'), placeholder: '0 = price on request', type: 'number', required: true },
      { key: 'description', label: t('createRealEstate.descriptionLabel'), placeholder: t('createRealEstate.descriptionPlaceholder', { defaultValue: 'Describe the property…' }), type: 'textarea', required: true },
      { key: 'website', label: `Website (${t('createMarketplace.optional', { defaultValue: 'optional' })})`, placeholder: 'https://…', type: 'text' },
    ],

    Motorcycles: [
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
    ],

    Boats: [
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
    ],

    farmequipment: [
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
    ],

    Jobs: [
      { key: 'title', label: t('jobsPage.application.fullNameLabel', { defaultValue: 'Job Title' }), placeholder: 'e.g. Senior Software Engineer', type: 'text', required: true },
      {
        key: 'jobType', label: t('subscription.jobType', { defaultValue: 'Job Type' }), type: 'dropdown', required: true,
        options: [
          { label: t('subcategories.jobs.fullTime'),   value: 'fullTime' },
          { label: t('subcategories.jobs.partTime'),   value: 'partTime' },
          { label: t('subcategories.jobs.freelance'),  value: 'freelance' },
          { label: t('common.other'),                  value: 'other' },
        ],
      },
      { key: 'companyName', label: t('mine.businesses.companyName', { defaultValue: 'Company' }), placeholder: 'e.g. Karaadi Ltd', type: 'text', required: true },
      { key: 'salaryRange', label: t('mine.subscriptions.priceRange', { defaultValue: 'Salary Range ($)' }), placeholder: 'e.g. 500-1500', type: 'text' },
      {
        key: 'experienceLevel', label: t('subscription.jobType', { defaultValue: 'Experience Level' }), type: 'dropdown',
        options: [
          { label: t('subcategories.jobsNested.experienceLevels.entry'),  value: 'entry' },
          { label: t('subcategories.jobsNested.experienceLevels.mid'),    value: 'mid' },
          { label: t('subcategories.jobsNested.experienceLevels.senior'), value: 'senior' },
        ],
      },
      {
        key: 'educationLevel', label: t('subscription.jobType', { defaultValue: 'Education Level' }), type: 'dropdown',
        options: [
          { label: t('subcategories.jobsNested.educationLevels.highschool'), value: 'highschool' },
          { label: t('subcategories.jobsNested.educationLevels.diploma'),    value: 'diploma' },
          { label: t('subcategories.jobsNested.educationLevels.bachelor'),   value: 'bachelor' },
          { label: t('subcategories.jobsNested.educationLevels.master'),     value: 'master' },
        ],
      },
      { key: 'applicationDeadline', label: t('jobsPage.application.fullNameLabel', { defaultValue: 'Application Deadline' }), placeholder: 'e.g. 2026-07-31', type: 'text' },
      { key: 'description', label: t('createMarketplace.descriptionLabel'), placeholder: 'Describe the role and responsibilities…', type: 'textarea', required: true },
    ],
  };
}

export const NUMERIC_KEYS = [
  'price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'sizeSqm',
  'hoursUsed', 'floor', 'totalFloors', 'engineCc', 'doors',
];

export const BOOLEAN_KEYS = ['furnished', 'parking', 'hasGarage', 'hasGarden'];
