import { createSubCategoryBuilder, defineSubCategory } from '../../lib/helpers/category/listingCategory.builders';
import { OTHER_SUBCATEGORY_ICON, SUBCATEGORY_ICONS } from '../../utils/icons';

const SUBCATEGORY_LABEL_ROOT = 'subcategories';

const OTHER_SUBCATEGORY = defineSubCategory({
  key: 'other',
  labelKey: 'common.other',
  icon: OTHER_SUBCATEGORY_ICON,
});

const SUBCATEGORY_GROUPS = {
  marketplace: {
    antiques: 'marketplaceNested.antiques',
    electronics: 'marketplaceNested.electronics',
    animalAndSupplies: 'marketplaceNested.animalAndSupplies',
    sportsAndOutdoors: 'marketplaceNested.sportsAndOutdoors',
    furniture: 'marketplaceNested.furniture',
    fashion: 'marketplaceNested.fashion',
    education: 'marketplaceNested.education',
  },
  realEstate: {
    forRent: 'realEstateNested.forRent',
    forSale: 'realEstateNested.forSale',
    landForSale: 'realEstateNested.landForSale',
    farmForSale: 'realEstateNested.farmForSale',
    commercial: 'realEstateNested.commercial',
  },
  cars: {
    carsForSale: 'carsNested.carsForSale',
    lease: 'carsNested.lease',
    trailers: 'carsNested.trailers',
    parts: 'carsNested.parts',
    trucks: 'carsNested.trucks',
    electric: 'carsNested.electric',
    buses: 'carsNested.buses',
  },
  motorcycles: {
    forSale: 'motorcyclesNested.forSale',
    forRent: 'motorcyclesNested.forRent',
    parts: 'motorcyclesNested.parts',
    other: 'motorcyclesNested.other',
  },
  boats: {
    boatsForSale: 'boatsNested.boatsForSale',
    boatsForRent: 'boatsNested.boatsForRent',
    engines: 'boatsNested.engines',
    parts: 'boatsNested.parts',
  },
  farmEquipment: {
    tractorForSale: 'traktorNested.tractorForSale',
    farmTools: 'traktorNested.farmTools',
    fertilizerSpreader: 'traktorNested.fertilizerSpreader',
    grainHarvester: 'traktorNested.grainHarvester',
    plow: 'traktorNested.plow',
    irrigation: 'traktorNested.irrigation',
  },
};

const buildSubCategories = createSubCategoryBuilder(SUBCATEGORY_LABEL_ROOT, OTHER_SUBCATEGORY);

export const MARKETPLACE_ANTIQUES_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.antiques,
  icons: SUBCATEGORY_ICONS.marketplace.antiques,
  items: ['bowls', 'parts', 'coffeeService', 'porcelain', 'vintage'],
});

export const MARKETPLACE_ELECTRONICS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.electronics,
  icons: SUBCATEGORY_ICONS.marketplace.electronics,
  items: ['mobilePhones', 'laptopsComputers', 'tvsAccessories', 'camerasPhotography', 'homeAppliances'],
});

export const MARKETPLACE_ANIMAL_AND_SUPPLIES_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.animalAndSupplies,
  icons: SUBCATEGORY_ICONS.marketplace.animalAndSupplies,
  items: ['camels', 'goats', 'cattle', 'sheep', 'horses', 'donkeys', 'poultry', 'feed', 'vetSupplies', 'accessories'],
});

export const MARKETPLACE_SPORTS_AND_OUTDOORS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.sportsAndOutdoors,
  icons: SUBCATEGORY_ICONS.marketplace.sportsAndOutdoors,
  items: ['gymEquipment', 'bicycles', 'sportingGoods', 'campingGear', 'toys'],
});

export const MARKETPLACE_FURNITURE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.furniture,
  icons: SUBCATEGORY_ICONS.marketplace.furniture,
  items: ['sofasCouches', 'bedsMattresses', 'tablesDesks', 'kitchenFurnishings'],
});

export const MARKETPLACE_FASHION_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.fashion,
  icons: SUBCATEGORY_ICONS.marketplace.fashion,
  items: ['mensClothing', 'womensClothing', 'shoesFootwear', 'bagsWallets'],
});

export const MARKETPLACE_EDUCATION_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.marketplace.education,
  icons: SUBCATEGORY_ICONS.marketplace.education,
  items: ['books', 'library', 'schoolSupplies', 'stationery'],
});

export const REAL_ESTATE_FOR_RENT_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.realEstate.forRent,
  icons: SUBCATEGORY_ICONS.realEstate.forRent,
  items: ['apartmentFlat', 'houseVilla', 'commercialOffice', 'warehouseStorage', 'singleRoom'],
});

export const REAL_ESTATE_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.realEstate.forSale,
  icons: SUBCATEGORY_ICONS.realEstate.forSale,
  items: ['newHouseVilla', 'usedHouseVilla', 'apartmentFlatForSale', 'completedBuilding'],
});

export const REAL_ESTATE_LAND_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.realEstate.landForSale,
  icons: SUBCATEGORY_ICONS.realEstate.landForSale,
  items: ['residentialLand', 'commercialLand', 'industrialLand'],
});

export const REAL_ESTATE_FARM_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.realEstate.farmForSale,
  icons: SUBCATEGORY_ICONS.realEstate.farmForSale,
  items: ['agriculturalLand', 'livestockFarm', 'treeForestFarms'],
});

export const REAL_ESTATE_COMMERCIAL_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.realEstate.commercial,
  icons: SUBCATEGORY_ICONS.realEstate.commercial,
  items: ['retailSpaceShop', 'hotelGuesthouse', 'commercialBuilding', 'largeWarehouse'],
});

export const CARS_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.carsForSale,
  icons: SUBCATEGORY_ICONS.cars.carsForSale,
  items: ['sedan', 'suv', 'hatchback', 'convertible', 'minivan'],
});

export const CARS_LEASE_CARS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.lease,
  icons: SUBCATEGORY_ICONS.cars.lease,
  includeOther: false,
  items: ['sedanLease', 'suvLease', 'vanMinibusLease', 'truckPickupLease', 'otherLeaseVehicles'],
});

export const CARS_TRAILERS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.trailers,
  icons: SUBCATEGORY_ICONS.cars.trailers,
  includeOther: false,
  items: ['trailerSpareParts', 'heavyDutyTrailer', 'otherTrailers'],
});

export const CAR_PARTS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.parts,
  icons: SUBCATEGORY_ICONS.cars.parts,
  items: ['engines', 'tiresRims', 'bodyParts'],
});

export const CARS_TRUCK_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.trucks,
  icons: SUBCATEGORY_ICONS.cars.trucks,
  includeOther: false,
  items: ['pickupTruck', 'heavyTruck', 'truckSpareParts', 'flatbedTankTruck', 'otherTrucks'],
});

export const CARS_ELECTRIC_CARS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.electric,
  icons: SUBCATEGORY_ICONS.cars.electric,
  includeOther: false,
  items: ['electricSedan', 'electricSUV', 'otherElectricCar'],
});

export const CARS_BUSES_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.cars.buses,
  icons: SUBCATEGORY_ICONS.cars.buses,
  items: ['coachBuses', 'minibuses', 'schoolBuses', 'cityBuses'],
});

export const MOTORCYCLES_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.motorcycles.forSale,
  icons: SUBCATEGORY_ICONS.motorcycles.forSale,
  items: ['motorcycle', 'vespa', 'bajaj', 'sportBikes', 'cargo'],
});

export const MOTORCYCLES_FOR_RENT_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.motorcycles.forRent,
  icons: SUBCATEGORY_ICONS.motorcycles.forRent,
  items: [
    'motorcycleRental',
    'vespaRental',
    'cargoMotorcycleRental',
    'bajajForRent',
    'cargoBajajRental',
    'dailyBajajRental',
  ],
});

export const MOTORCYCLES_SPARE_PARTS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.motorcycles.parts,
  icons: SUBCATEGORY_ICONS.motorcycles.parts,
  items: ['motorcycleEngines', 'tiresRims', 'protectiveGear', 'bajajEngines', 'bajajBodyParts'],
});

export const MOTORCYCLES_OTHER_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.motorcycles.other,
  icons: SUBCATEGORY_ICONS.motorcycles.other,
  includeOther: false,
  items: ['miscellaneousEquipment'],
});

export const BOATS_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.boats.boatsForSale,
  icons: SUBCATEGORY_ICONS.boats.boatsForSale,
  items: ['fishingBoat', 'leisureYacht', 'sailboat', 'speedboat'],
});

export const BOATS_FOR_RENT_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.boats.boatsForRent,
  icons: SUBCATEGORY_ICONS.boats.boatsForRent,
  items: ['fishingBoatRental', 'yachtCharter'],
});

export const BOAT_ENGINES_FOR_SALE_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.boats.engines,
  icons: SUBCATEGORY_ICONS.boats.engines,
  items: ['outboardEngine', 'inboardEngine', 'usedEngine'],
});

export const BOAT_PARTS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.boats.parts,
  icons: SUBCATEGORY_ICONS.boats.parts,
  items: ['engineParts', 'navigationEquipment', 'safetyGear'],
});

export const FARM_EQUIPMENT_TRACTOR_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.tractorForSale,
  icons: SUBCATEGORY_ICONS.farmEquipment.tractorForSale,
  items: ['newTractor', 'usedTractor'],
});

export const FARM_EQUIPMENT_TOOLS_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.farmTools,
  icons: SUBCATEGORY_ICONS.farmEquipment.farmTools,
  items: ['plowTillageEquipment', 'seedingEquipment', 'harvestingEquipment'],
});

export const FARM_EQUIPMENT_FERTILIZER_SPREADER_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.fertilizerSpreader,
  icons: SUBCATEGORY_ICONS.farmEquipment.fertilizerSpreader,
  items: ['mountedSpreader', 'towedSpreader'],
});

export const FARM_EQUIPMENT_HARVESTER_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.grainHarvester,
  icons: SUBCATEGORY_ICONS.farmEquipment.grainHarvester,
  items: ['selfPropelledHarvester', 'pullTypeHarvester'],
});

export const FARM_EQUIPMENT_PLOW_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.plow,
  icons: SUBCATEGORY_ICONS.farmEquipment.plow,
  items: ['moldboardPlow', 'discPlow', 'subsoilPlow'],
});

export const FARM_EQUIPMENT_IRRIGATION_SUBCATEGORIES = buildSubCategories({
  group: SUBCATEGORY_GROUPS.farmEquipment.irrigation,
  icons: SUBCATEGORY_ICONS.farmEquipment.irrigation,
  items: ['dripIrrigation', 'sprinklerIrrigation', 'floodIrrigation', 'waterPumps'],
});
