import type { FieldDef } from '../../../util/types/new-ad.types';

export const FIELDS: Record<string, FieldDef[]> = {
  Marketplace: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Samsung Galaxy S23', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Category', type: 'dropdown', required: true,
      options: [
        { label: 'Antiques & Art',      value: 'antiques' },
        { label: 'Electronics',         value: 'electronics' },
        { label: 'Animal & Supplies',   value: 'animalAndSupplies' },
        { label: 'Sports & Outdoors',   value: 'sportsAndOutdoors' },
        { label: 'Furniture',           value: 'furniture' },
        { label: 'Fashion',             value: 'fashion' },
        { label: 'Education',           value: 'education' },
      ],
    },
    { key: 'condition', label: 'Condition', type: 'dropdown', options: ['New', 'Used – Like New', 'Used – Good', 'Used – Fair'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number' },
    { key: 'description', label: 'Description', placeholder: 'Describe your item in detail…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  Cars: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Toyota Camry 2022', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Category', type: 'dropdown', required: true,
      options: [
        { label: 'Cars For Sale',  value: 'carsForSale' },
        { label: 'Lease Cars',     value: 'leaseCars' },
        { label: 'Trailers',       value: 'trailers' },
        { label: 'Car Parts',      value: 'carParts' },
        { label: 'Truck',          value: 'truck' },
        { label: 'Electric Cars',  value: 'electricCars' },
        { label: 'Buses',          value: 'buses' },
      ],
    },
    { key: 'make', label: 'Make / Brand', placeholder: 'e.g. Toyota', type: 'text', required: true },
    { key: 'model', label: 'Model', placeholder: 'e.g. Camry', type: 'text', required: true },
    { key: 'trim', label: 'Trim / Variant', placeholder: 'e.g. LE, XSE', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2022', type: 'number' },
    { key: 'mileage', label: 'Mileage (km)', placeholder: 'e.g. 45000', type: 'number' },
    { key: 'fuelType', label: 'Fuel Type', type: 'dropdown', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'] },
    { key: 'gearbox', label: 'Gearbox', type: 'dropdown', options: ['Manual', 'Automatic'] },
    { key: 'engineSize', label: 'Engine Size', placeholder: 'e.g. 2.5L', type: 'text' },
    { key: 'doors', label: 'Doors', placeholder: 'e.g. 4', type: 'number' },
    { key: 'color', label: 'Color', placeholder: 'e.g. White', type: 'text' },
    { key: 'condition', label: 'Condition', type: 'dropdown', required: true, options: ['New', 'Used', 'Certified Pre-Owned'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe your car…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  RealEstate: [
    { key: 'title', label: 'Title', placeholder: 'e.g. 3BR Apartment Mogadishu', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Listing Type', type: 'dropdown', required: true,
      options: [
        { label: 'For Rent',       value: 'forRent' },
        { label: 'For Sale',       value: 'forSale' },
        { label: 'Land For Sale',  value: 'landForSale' },
        { label: 'Farm For Sale',  value: 'farmForSale' },
        { label: 'Commercial',     value: 'commercial' },
      ],
    },
    {
      key: 'propertyType', label: 'Property Type', type: 'dropdown',
      options: [
        { label: 'Apartment',        value: 'apartment' },
        { label: 'House / Villa',    value: 'houseVilla' },
        { label: 'Commercial Space', value: 'commercialSpace' },
        { label: 'Warehouse',        value: 'warehouse' },
        { label: 'Land',             value: 'land' },
        { label: 'Farm',             value: 'farm' },
        { label: 'Other',            value: 'other' },
      ],
    },
    { key: 'bedrooms', label: 'Bedrooms', placeholder: 'e.g. 3', type: 'number' },
    { key: 'bathrooms', label: 'Bathrooms', placeholder: 'e.g. 2', type: 'number' },
    { key: 'sizeSqm', label: 'Size (sqm)', placeholder: 'e.g. 120', type: 'number' },
    { key: 'floor', label: 'Floor', placeholder: 'e.g. 3', type: 'number' },
    { key: 'totalFloors', label: 'Total Floors', placeholder: 'e.g. 10', type: 'number' },
    { key: 'furnished', label: 'Furnished', type: 'dropdown', options: ['Yes', 'No'] },
    { key: 'parking', label: 'Parking', type: 'dropdown', options: ['Yes', 'No'] },
    { key: 'hasGarage', label: 'Garage', type: 'dropdown', options: ['Yes', 'No'] },
    { key: 'hasGarden', label: 'Garden', type: 'dropdown', options: ['Yes', 'No'] },
    { key: 'address', label: 'Address', placeholder: 'Street / area (optional)', type: 'text' },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the property…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  Motorcycles: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Honda CB500 2021', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Category', type: 'dropdown', required: true,
      options: [
        { label: 'For Sale',    value: 'forSale' },
        { label: 'For Rent',    value: 'forRent' },
        { label: 'Spare Parts', value: 'spareParts' },
        { label: 'Other',       value: 'other' },
      ],
    },
    { key: 'make', label: 'Make / Brand', placeholder: 'e.g. Honda', type: 'text', required: true },
    { key: 'model', label: 'Model', placeholder: 'e.g. CB500', type: 'text', required: true },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2021', type: 'number', required: true },
    { key: 'engineCc', label: 'Engine (cc)', placeholder: 'e.g. 500', type: 'number' },
    { key: 'mileage', label: 'Mileage (km)', placeholder: 'e.g. 8000', type: 'number' },
    {
      key: 'fuelType', label: 'Fuel Type', type: 'dropdown',
      options: [
        { label: 'Petrol',   value: 'petrol' },
        { label: 'Electric', value: 'electric' },
        { label: 'Other',    value: 'other' },
      ],
    },
    {
      key: 'gearbox', label: 'Gearbox', type: 'dropdown',
      options: [
        { label: 'Manual',         value: 'manual' },
        { label: 'Automatic',      value: 'automatic' },
        { label: 'Semi-Automatic', value: 'semiAutomatic' },
      ],
    },
    { key: 'color', label: 'Color', placeholder: 'e.g. Red', type: 'text' },
    {
      key: 'condition', label: 'Condition', type: 'dropdown', required: true,
      options: [
        { label: 'New',  value: 'new' },
        { label: 'Used', value: 'used' },
      ],
    },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe your motorcycle…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  Boats: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Fishing Boat 2019', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Category', type: 'dropdown', required: true,
      options: [
        { label: 'Boats For Sale',  value: 'boatsForSale' },
        { label: 'Boats For Rent',  value: 'boatsForRent' },
        { label: 'Boat Engines',    value: 'boatEnginesForSale' },
        { label: 'Boat Parts',      value: 'boatParts' },
      ],
    },
    { key: 'type', label: 'Boat Type', placeholder: 'e.g. Fishing / Yacht', type: 'text', required: true },
    { key: 'boatModel', label: 'Model', placeholder: 'e.g. F40', type: 'text', required: true },
    { key: 'transmission', label: 'Transmission', type: 'dropdown', options: ['Manual', 'Automatic'] },
    { key: 'color', label: 'Color', placeholder: 'e.g. Blue', type: 'text', required: true },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the boat…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  farmequipment: [
    { key: 'title', label: 'Title', placeholder: 'e.g. John Deere 5075E 2020', type: 'text', required: true },
    {
      key: 'subcategory', label: 'Category', type: 'dropdown', required: true,
      options: [
        { label: 'Tractor',              value: 'tractor' },
        { label: 'Farm Tools',           value: 'tools' },
        { label: 'Fertilizer Spreader',  value: 'fertilizerSpreader' },
        { label: 'Grain Harvester',      value: 'harvester' },
        { label: 'Plow',                 value: 'plow' },
        { label: 'Irrigation System',    value: 'irrigation' },
      ],
    },
    { key: 'brand', label: 'Brand', placeholder: 'e.g. John Deere', type: 'text', required: true },
    { key: 'equipmentType', label: 'Equipment Type', placeholder: 'e.g. Tractor', type: 'text' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2020', type: 'number' },
    { key: 'hoursUsed', label: 'Hours Used', placeholder: 'e.g. 1200', type: 'number' },
    {
      key: 'condition', label: 'Condition', type: 'dropdown', required: true,
      options: [
        { label: 'New',         value: 'new' },
        { label: 'Used',        value: 'used' },
        { label: 'Refurbished', value: 'refurbished' },
      ],
    },
    { key: 'attachmentsIncluded', label: 'Attachments Included', placeholder: 'e.g. Cultivator, Trailer', type: 'text' },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', type: 'number', required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the equipment…', type: 'textarea', required: true },
    { key: 'website', label: 'Website (optional)', placeholder: 'https://…', type: 'text' },
  ],

  Jobs: [
    { key: 'title', label: 'Job Title', placeholder: 'e.g. Senior Software Engineer', type: 'text', required: true },
    {
      key: 'jobType', label: 'Job Type', type: 'dropdown', required: true,
      options: [
        { label: 'Full Time',   value: 'fullTime' },
        { label: 'Part Time',   value: 'partTime' },
        { label: 'Freelance',   value: 'freelance' },
        { label: 'Other',       value: 'other' },
      ],
    },
    { key: 'companyName', label: 'Company', placeholder: 'e.g. Karaadi Ltd', type: 'text', required: true },
    { key: 'salaryRange', label: 'Salary Range ($)', placeholder: 'e.g. 500-1500', type: 'text' },
    {
      key: 'experienceLevel', label: 'Experience Level', type: 'dropdown',
      options: [
        { label: 'Entry Level',  value: 'entry' },
        { label: 'Mid Level',    value: 'mid' },
        { label: 'Senior Level', value: 'senior' },
      ],
    },
    {
      key: 'educationLevel', label: 'Education Level', type: 'dropdown',
      options: [
        { label: 'High School',   value: 'highschool' },
        { label: 'Diploma',       value: 'diploma' },
        { label: "Bachelor's",    value: 'bachelor' },
        { label: "Master's/PhD",  value: 'master' },
      ],
    },
    { key: 'applicationDeadline', label: 'Application Deadline', placeholder: 'e.g. 2026-07-31', type: 'text' },
    { key: 'description', label: 'Job Description', placeholder: 'Describe the role and responsibilities…', type: 'textarea', required: true },
  ],
};

export const NUMERIC_KEYS = [
  'price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'sizeSqm',
  'hoursUsed', 'floor', 'totalFloors', 'engineCc', 'doors',
];

export const BOOLEAN_KEYS = ['furnished', 'parking', 'hasGarage', 'hasGarden'];
