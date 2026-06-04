export interface NestedSubCategory {
  key: string;
  labelKey: string;
  icon: string;
}

export interface SubCategory {
  key: string;
  name: string;
  icon: string;
  nested?: NestedSubCategory[];
}

export interface MainCategory {
  key: string;
  name: string;
  icon: string;
  color: string;
  apiPath: string;
  subCategories: SubCategory[];
}

const CAT_COLORS = {
  marketplace: "#9333EA",
  realEstate: "#2563EB",
  cars: "#4F46E5",
  motorcycles: "#EA580C",
  boats: "#0891B2",
  farmEquipment: "#16A34A",
  jobs: "#4B5563",
} as const;

const CAT_PATHS = {
  marketplace: "/api/marketplace",
  realEstate: "/api/real-estate",
  cars: "/api/cars",
  motorcycles: "/api/motorcycles",
  boats: "/api/boats",
  farmEquipment: "/api/traktor",
  jobs: "/api/jobs",
} as const;

const OTHER: NestedSubCategory = {
  key: "other",
  labelKey: "common.other",
  icon: "dots-horizontal-circle-outline",
};

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    key: "Marketplace",
    name: "Marketplace",
    icon: "storefront-outline",
    color: CAT_COLORS.marketplace,
    apiPath: CAT_PATHS.marketplace,
    subCategories: [
      {
        key: "antiques",
        name: "Antiques & Art",
        icon: "brush-outline",
        nested: [
          {
            key: "bowls",
            labelKey: "subcategories.marketplaceNested.antiques.bowls",
            icon: "bowl",
          },
          {
            key: "parts",
            labelKey: "subcategories.marketplaceNested.antiques.parts",
            icon: "puzzle-outline",
          },
          {
            key: "coffeeService",
            labelKey: "subcategories.marketplaceNested.antiques.coffeeService",
            icon: "coffee-outline",
          },
          {
            key: "porcelain",
            labelKey: "subcategories.marketplaceNested.antiques.porcelain",
            icon: "cup",
          },
          {
            key: "vintage",
            labelKey: "subcategories.marketplaceNested.antiques.vintage",
            icon: "clock-outline",
          },
          OTHER,
        ],
      },
      {
        key: "electronics",
        name: "Electronics",
        icon: "monitor",
        nested: [
          {
            key: "mobilePhones",
            labelKey:
              "subcategories.marketplaceNested.electronics.mobilePhones",
            icon: "cellphone",
          },
          {
            key: "laptopsComputers",
            labelKey:
              "subcategories.marketplaceNested.electronics.laptopsComputers",
            icon: "laptop",
          },
          {
            key: "tvsAccessories",
            labelKey:
              "subcategories.marketplaceNested.electronics.tvsAccessories",
            icon: "television",
          },
          {
            key: "camerasPhotography",
            labelKey:
              "subcategories.marketplaceNested.electronics.camerasPhotography",
            icon: "camera-outline",
          },
          {
            key: "homeAppliances",
            labelKey:
              "subcategories.marketplaceNested.electronics.homeAppliances",
            icon: "washing-machine",
          },
          OTHER,
        ],
      },
      {
        key: "animalAndSupplies",
        name: "Animal & Supplies",
        icon: "paw-outline",
        nested: [
          {
            key: "camels",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.camels",
            icon: "camel",
          },
          {
            key: "goats",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.goats",
            icon: "paw-outline",
          },
          {
            key: "cattle",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.cattle",
            icon: "cow",
          },
          {
            key: "sheep",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.sheep",
            icon: "paw-outline",
          },
          {
            key: "horses",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.horses",
            icon: "horse-variant",
          },
          {
            key: "donkeys",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.donkeys",
            icon: "paw-outline",
          },
          {
            key: "poultry",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.poultry",
            icon: "bird",
          },
          {
            key: "feed",
            labelKey: "subcategories.marketplaceNested.animalAndSupplies.feed",
            icon: "food",
          },
          {
            key: "vetSupplies",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.vetSupplies",
            icon: "medical-bag",
          },
          {
            key: "accessories",
            labelKey:
              "subcategories.marketplaceNested.animalAndSupplies.accessories",
            icon: "tag-outline",
          },
          OTHER,
        ],
      },
      {
        key: "sportsAndOutdoors",
        name: "Sports & Outdoors",
        icon: "soccer",
        nested: [
          {
            key: "gymEquipment",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.gymEquipment",
            icon: "dumbbell",
          },
          {
            key: "bicycles",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.bicycles",
            icon: "bicycle",
          },
          {
            key: "sportingGoods",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.sportingGoods",
            icon: "basketball",
          },
          {
            key: "campingGear",
            labelKey:
              "subcategories.marketplaceNested.sportsAndOutdoors.campingGear",
            icon: "tent",
          },
          {
            key: "toys",
            labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.toys",
            icon: "puzzle",
          },
          OTHER,
        ],
      },
      {
        key: "furniture",
        name: "Furniture",
        icon: "sofa-outline",
        nested: [
          {
            key: "sofasCouches",
            labelKey: "subcategories.marketplaceNested.furniture.sofasCouches",
            icon: "sofa-outline",
          },
          {
            key: "bedsMattresses",
            labelKey:
              "subcategories.marketplaceNested.furniture.bedsMattresses",
            icon: "bed-outline",
          },
          {
            key: "tablesDesks",
            labelKey: "subcategories.marketplaceNested.furniture.tablesDesks",
            icon: "table-furniture",
          },
          {
            key: "kitchenFurnishings",
            labelKey:
              "subcategories.marketplaceNested.furniture.kitchenFurnishings",
            icon: "stove",
          },
          OTHER,
        ],
      },
      {
        key: "fashion",
        name: "Fashion",
        icon: "tshirt-crew-outline",
        nested: [
          {
            key: "mensClothing",
            labelKey: "subcategories.marketplaceNested.fashion.mensClothing",
            icon: "tshirt-crew-outline",
          },
          {
            key: "womensClothing",
            labelKey: "subcategories.marketplaceNested.fashion.womensClothing",
            icon: "hanger",
          },
          {
            key: "shoesFootwear",
            labelKey: "subcategories.marketplaceNested.fashion.shoesFootwear",
            icon: "shoe-heel",
          },
          {
            key: "bagsWallets",
            labelKey: "subcategories.marketplaceNested.fashion.bagsWallets",
            icon: "bag-personal-outline",
          },
          OTHER,
        ],
      },
      { key: "education", name: "Education", icon: "school-outline" },
    ],
  },
  {
    key: "RealEstate",
    name: "Real Estate",
    icon: "home-outline",
    color: CAT_COLORS.realEstate,
    apiPath: CAT_PATHS.realEstate,
    subCategories: [
      {
        key: "forRent",
        name: "For Rent",
        icon: "key-outline",
        nested: [
          {
            key: "apartmentFlat",
            labelKey: "subcategories.realEstateNested.forRent.apartmentFlat",
            icon: "office-building-outline",
          },
          {
            key: "houseVilla",
            labelKey: "subcategories.realEstateNested.forRent.houseVilla",
            icon: "home-outline",
          },
          {
            key: "commercialOffice",
            labelKey: "subcategories.realEstateNested.forRent.commercialOffice",
            icon: "store-outline",
          },
          {
            key: "warehouseStorage",
            labelKey: "subcategories.realEstateNested.forRent.warehouseStorage",
            icon: "warehouse",
          },
          {
            key: "singleRoom",
            labelKey: "subcategories.realEstateNested.forRent.singleRoom",
            icon: "door",
          },
          OTHER,
        ],
      },
      {
        key: "forSale",
        name: "For Sale",
        icon: "home-city-outline",
        nested: [
          {
            key: "newHouseVilla",
            labelKey: "subcategories.realEstateNested.forSale.newHouseVilla",
            icon: "home-plus-outline",
          },
          {
            key: "usedHouseVilla",
            labelKey: "subcategories.realEstateNested.forSale.usedHouseVilla",
            icon: "home-outline",
          },
          {
            key: "apartmentFlatForSale",
            labelKey:
              "subcategories.realEstateNested.forSale.apartmentFlatForSale",
            icon: "office-building-outline",
          },
          {
            key: "completedBuilding",
            labelKey:
              "subcategories.realEstateNested.forSale.completedBuilding",
            icon: "office-building",
          },
          OTHER,
        ],
      },
      {
        key: "landForSale",
        name: "Land For Sale",
        icon: "terrain",
        nested: [
          {
            key: "residentialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.residentialLand",
            icon: "home-outline",
          },
          {
            key: "commercialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.commercialLand",
            icon: "store-outline",
          },
          {
            key: "industrialLand",
            labelKey:
              "subcategories.realEstateNested.landForSale.industrialLand",
            icon: "factory",
          },
          OTHER,
        ],
      },
      {
        key: "farmForSale",
        name: "Farm For Sale",
        icon: "barn",
        nested: [
          {
            key: "agriculturalLand",
            labelKey:
              "subcategories.realEstateNested.farmForSale.agriculturalLand",
            icon: "sprout-outline",
          },
          {
            key: "livestockFarm",
            labelKey:
              "subcategories.realEstateNested.farmForSale.livestockFarm",
            icon: "cow",
          },
          {
            key: "treeForestFarms",
            labelKey:
              "subcategories.realEstateNested.farmForSale.treeForestFarms",
            icon: "tree-outline",
          },
          OTHER,
        ],
      },
      {
        key: "commercial",
        name: "Commercial",
        icon: "office-building-outline",
        nested: [
          {
            key: "retailSpaceShop",
            labelKey:
              "subcategories.realEstateNested.commercial.retailSpaceShop",
            icon: "store-outline",
          },
          {
            key: "hotelGuesthouse",
            labelKey:
              "subcategories.realEstateNested.commercial.hotelGuesthouse",
            icon: "bed-outline",
          },
          {
            key: "commercialBuilding",
            labelKey:
              "subcategories.realEstateNested.commercial.commercialBuilding",
            icon: "office-building",
          },
          {
            key: "largeWarehouse",
            labelKey:
              "subcategories.realEstateNested.commercial.largeWarehouse",
            icon: "warehouse",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "Cars",
    name: "Cars",
    icon: "car-outline",
    color: CAT_COLORS.cars,
    apiPath: CAT_PATHS.cars,
    subCategories: [
      {
        key: "carsForSale",
        name: "Cars For Sale",
        icon: "car-outline",
        nested: [
          {
            key: "sedan",
            labelKey: "subcategories.carsNested.carsForSale.sedan",
            icon: "car-outline",
          },
          {
            key: "suv",
            labelKey: "subcategories.carsNested.carsForSale.suv",
            icon: "car-sports",
          },
          {
            key: "hatchback",
            labelKey: "subcategories.carsNested.carsForSale.hatchback",
            icon: "car-outline",
          },
          {
            key: "convertible",
            labelKey: "subcategories.carsNested.carsForSale.convertible",
            icon: "car-convertible",
          },
          {
            key: "minivan",
            labelKey: "subcategories.carsNested.carsForSale.minivan",
            icon: "van-passenger",
          },
          OTHER,
        ],
      },
      {
        key: "leaseCars",
        name: "Lease Cars",
        icon: "car-key",
        nested: [
          {
            key: "sedanLease",
            labelKey: "subcategories.carsNested.lease.sedanLease",
            icon: "car-outline",
          },
          {
            key: "suvLease",
            labelKey: "subcategories.carsNested.lease.suvLease",
            icon: "car-sports",
          },
          {
            key: "vanMinibusLease",
            labelKey: "subcategories.carsNested.lease.vanMinibusLease",
            icon: "van-passenger",
          },
          {
            key: "truckPickupLease",
            labelKey: "subcategories.carsNested.lease.truckPickupLease",
            icon: "truck-outline",
          },
          {
            key: "otherLeaseVehicles",
            labelKey: "subcategories.carsNested.lease.otherLeaseVehicles",
            icon: "car-key",
          },
        ],
      },
      {
        key: "trailers",
        name: "Trailers",
        icon: "truck-outline",
        nested: [
          {
            key: "trailerSpareParts",
            labelKey: "subcategories.carsNested.trailers.trailerSpareParts",
            icon: "wrench-outline",
          },
          {
            key: "heavyDutyTrailer",
            labelKey: "subcategories.carsNested.trailers.heavyDutyTrailer",
            icon: "truck-trailer",
          },
          {
            key: "otherTrailers",
            labelKey: "subcategories.carsNested.trailers.otherTrailers",
            icon: "dots-horizontal-circle-outline",
          },
        ],
      },
      {
        key: "carParts",
        name: "Car Parts",
        icon: "car-cog",
        nested: [
          {
            key: "engines",
            labelKey: "subcategories.carsNested.parts.engines",
            icon: "engine-outline",
          },
          {
            key: "tiresRims",
            labelKey: "subcategories.carsNested.parts.tiresRims",
            icon: "tire",
          },
          {
            key: "bodyParts",
            labelKey: "subcategories.carsNested.parts.bodyParts",
            icon: "car-wrench",
          },
          OTHER,
        ],
      },
      {
        key: "truck",
        name: "Truck",
        icon: "truck-outline",
        nested: [
          {
            key: "pickupTruck",
            labelKey: "subcategories.carsNested.trucks.pickupTruck",
            icon: "truck-outline",
          },
          {
            key: "heavyTruck",
            labelKey: "subcategories.carsNested.trucks.heavyTruck",
            icon: "truck",
          },
          {
            key: "truckSpareParts",
            labelKey: "subcategories.carsNested.trucks.truckSpareParts",
            icon: "wrench-outline",
          },
          {
            key: "flatbedTankTruck",
            labelKey: "subcategories.carsNested.trucks.flatbedTankTruck",
            icon: "tanker-truck",
          },
          {
            key: "otherTrucks",
            labelKey: "subcategories.carsNested.trucks.otherTrucks",
            icon: "dots-horizontal-circle-outline",
          },
        ],
      },
      {
        key: "electricCars",
        name: "Electric Cars",
        icon: "car-electric-outline",
        nested: [
          {
            key: "electricSedan",
            labelKey: "subcategories.carsNested.electric.electricSedan",
            icon: "car-electric-outline",
          },
          {
            key: "electricSUV",
            labelKey: "subcategories.carsNested.electric.electricSUV",
            icon: "car-electric-outline",
          },
          {
            key: "otherElectricCar",
            labelKey: "subcategories.carsNested.electric.otherElectricCar",
            icon: "car-key",
          },
        ],
      },
      {
        key: "buses",
        name: "Buses",
        icon: "bus",
        nested: [
          {
            key: "coachBuses",
            labelKey: "subcategories.carsNested.buses.coachBuses",
            icon: "bus-double-decker",
          },
          {
            key: "minibuses",
            labelKey: "subcategories.carsNested.buses.minibuses",
            icon: "van-passenger",
          },
          {
            key: "schoolBuses",
            labelKey: "subcategories.carsNested.buses.schoolBuses",
            icon: "bus-school",
          },
          {
            key: "cityBuses",
            labelKey: "subcategories.carsNested.buses.cityBuses",
            icon: "bus",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "Motorcycles",
    name: "Motorcycles",
    icon: "motorbike",
    color: CAT_COLORS.motorcycles,
    apiPath: CAT_PATHS.motorcycles,
    subCategories: [
      {
        key: "forSale",
        name: "For Sale",
        icon: "motorbike",
        nested: [
          {
            key: "motorcycle",
            labelKey: "subcategories.motorcyclesNested.forSale.motorcycle",
            icon: "motorbike",
          },
          {
            key: "vespa",
            labelKey: "subcategories.motorcyclesNested.forSale.vespa",
            icon: "motorbike",
          },
          {
            key: "bajaj",
            labelKey: "subcategories.motorcyclesNested.forSale.bajaj",
            icon: "motorbike",
          },
          {
            key: "sportBikes",
            labelKey: "subcategories.motorcyclesNested.forSale.sportBikes",
            icon: "bicycle",
          },
          {
            key: "cargo",
            labelKey: "subcategories.motorcyclesNested.forSale.cargo",
            icon: "truck-cargo-container",
          },
          OTHER,
        ],
      },
      {
        key: "forRent",
        name: "For Rent",
        icon: "motorbike",
        nested: [
          {
            key: "motorcycleRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.motorcycleRental",
            icon: "motorbike",
          },
          {
            key: "vespaRental",
            labelKey: "subcategories.motorcyclesNested.forRent.vespaRental",
            icon: "motorbike",
          },
          {
            key: "cargoMotorcycleRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.cargoMotorcycleRental",
            icon: "truck-cargo-container",
          },
          {
            key: "bajajForRent",
            labelKey: "subcategories.motorcyclesNested.forRent.bajajForRent",
            icon: "motorbike",
          },
          {
            key: "cargoBajajRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.cargoBajajRental",
            icon: "truck-cargo-container",
          },
          {
            key: "dailyBajajRental",
            labelKey:
              "subcategories.motorcyclesNested.forRent.dailyBajajRental",
            icon: "motorbike",
          },
          OTHER,
        ],
      },
      {
        key: "spareParts",
        name: "Spare Parts",
        icon: "tools",
        nested: [
          {
            key: "motorcycleEngines",
            labelKey: "subcategories.motorcyclesNested.parts.motorcycleEngines",
            icon: "engine-outline",
          },
          {
            key: "tiresRims",
            labelKey: "subcategories.motorcyclesNested.parts.tiresRims",
            icon: "tire",
          },
          {
            key: "protectiveGear",
            labelKey: "subcategories.motorcyclesNested.parts.protectiveGear",
            icon: "shield-outline",
          },
          {
            key: "bajajEngines",
            labelKey: "subcategories.motorcyclesNested.parts.bajajEngines",
            icon: "engine-outline",
          },
          {
            key: "bajajBodyParts",
            labelKey: "subcategories.motorcyclesNested.parts.bajajBodyParts",
            icon: "wrench-outline",
          },
          OTHER,
        ],
      },
      {
        key: "other",
        name: "Other",
        icon: "dots-horizontal-circle-outline",
        nested: [
          {
            key: "miscellaneousEquipment",
            labelKey:
              "subcategories.motorcyclesNested.other.miscellaneousEquipment",
            icon: "toolbox-outline",
          },
        ],
      },
    ],
  },
  {
    key: "Boats",
    name: "Boats",
    icon: "sail-boat",
    color: CAT_COLORS.boats,
    apiPath: CAT_PATHS.boats,
    subCategories: [
      {
        key: "boatsForSale",
        name: "Boats For Sale",
        icon: "sail-boat",
        nested: [
          {
            key: "fishingBoat",
            labelKey: "subcategories.boatsNested.boatsForSale.fishingBoat",
            icon: "fish",
          },
          {
            key: "leisureYacht",
            labelKey: "subcategories.boatsNested.boatsForSale.leisureYacht",
            icon: "sail-boat",
          },
          {
            key: "sailboat",
            labelKey: "subcategories.boatsNested.boatsForSale.sailboat",
            icon: "sail-boat",
          },
          {
            key: "speedboat",
            labelKey: "subcategories.boatsNested.boatsForSale.speedboat",
            icon: "ferry",
          },
          OTHER,
        ],
      },
      {
        key: "boatsForRent",
        name: "Boats For Rent",
        icon: "ferry",
        nested: [
          {
            key: "fishingBoatRental",
            labelKey:
              "subcategories.boatsNested.boatsForRent.fishingBoatRental",
            icon: "fish",
          },
          {
            key: "yachtCharter",
            labelKey: "subcategories.boatsNested.boatsForRent.yachtCharter",
            icon: "sail-boat",
          },
          OTHER,
        ],
      },
      {
        key: "boatEnginesForSale",
        name: "Boat Engines",
        icon: "engine-outline",
        nested: [
          {
            key: "outboardEngine",
            labelKey: "subcategories.boatsNested.engines.outboardEngine",
            icon: "engine-outline",
          },
          {
            key: "inboardEngine",
            labelKey: "subcategories.boatsNested.engines.inboardEngine",
            icon: "engine-outline",
          },
          {
            key: "usedEngine",
            labelKey: "subcategories.boatsNested.engines.usedEngine",
            icon: "wrench-outline",
          },
          OTHER,
        ],
      },
      {
        key: "boatParts",
        name: "Boat Parts",
        icon: "tools",
        nested: [
          {
            key: "engineParts",
            labelKey: "subcategories.boatsNested.parts.engineParts",
            icon: "wrench-outline",
          },
          {
            key: "navigationEquipment",
            labelKey: "subcategories.boatsNested.parts.navigationEquipment",
            icon: "compass-outline",
          },
          {
            key: "safetyGear",
            labelKey: "subcategories.boatsNested.parts.safetyGear",
            icon: "shield-outline",
          },
          OTHER,
        ],
      },
    ],
  },
  {
    key: "farmequipment",
    name: "Farm Equipment",
    icon: "tractor",
    color: CAT_COLORS.farmEquipment,
    apiPath: CAT_PATHS.farmEquipment,
    subCategories: [
      {
        key: "tractor",
        name: "Tractor",
        icon: "tractor",
        nested: [
          {
            key: "newTractor",
            labelKey: "subcategories.traktorNested.tractorForSale.newTractor",
            icon: "tractor",
          },
          {
            key: "usedTractor",
            labelKey: "subcategories.traktorNested.tractorForSale.usedTractor",
            icon: "tractor",
          },
          OTHER,
        ],
      },
      {
        key: "tools",
        name: "Farm Tools",
        icon: "shovel",
        nested: [
          {
            key: "plowTillageEquipment",
            labelKey:
              "subcategories.traktorNested.farmTools.plowTillageEquipment",
            icon: "shovel",
          },
          {
            key: "seedingEquipment",
            labelKey: "subcategories.traktorNested.farmTools.seedingEquipment",
            icon: "seed-outline",
          },
          {
            key: "harvestingEquipment",
            labelKey:
              "subcategories.traktorNested.farmTools.harvestingEquipment",
            icon: "corn",
          },
          OTHER,
        ],
      },
      {
        key: "fertilizerSpreader",
        name: "Fertilizer Spreader",
        icon: "spray-bottle",
        nested: [
          {
            key: "mountedSpreader",
            labelKey:
              "subcategories.traktorNested.fertilizerSpreader.mountedSpreader",
            icon: "spray-bottle",
          },
          {
            key: "towedSpreader",
            labelKey:
              "subcategories.traktorNested.fertilizerSpreader.towedSpreader",
            icon: "spray-bottle",
          },
          OTHER,
        ],
      },
      {
        key: "harvester",
        name: "Grain Harvester",
        icon: "grain",
        nested: [
          {
            key: "selfPropelledHarvester",
            labelKey:
              "subcategories.traktorNested.grainHarvester.selfPropelledHarvester",
            icon: "tractor",
          },
          {
            key: "pullTypeHarvester",
            labelKey:
              "subcategories.traktorNested.grainHarvester.pullTypeHarvester",
            icon: "tractor",
          },
          OTHER,
        ],
      },
      {
        key: "plow",
        name: "Plow",
        icon: "tools",
        nested: [
          {
            key: "moldboardPlow",
            labelKey: "subcategories.traktorNested.plow.moldboardPlow",
            icon: "shovel",
          },
          {
            key: "discPlow",
            labelKey: "subcategories.traktorNested.plow.discPlow",
            icon: "shovel",
          },
          {
            key: "subsoilPlow",
            labelKey: "subcategories.traktorNested.plow.subsoilPlow",
            icon: "shovel",
          },
          OTHER,
        ],
      },
      {
        key: "irrigation",
        name: "Irrigation System",
        icon: "water-outline",
        nested: [
          {
            key: "dripIrrigation",
            labelKey: "subcategories.traktorNested.irrigation.dripIrrigation",
            icon: "water-outline",
          },
          {
            key: "sprinklerIrrigation",
            labelKey:
              "subcategories.traktorNested.irrigation.sprinklerIrrigation",
            icon: "sprinkler",
          },
          {
            key: "floodIrrigation",
            labelKey: "subcategories.traktorNested.irrigation.floodIrrigation",
            icon: "waves",
          },
          {
            key: "waterPumps",
            labelKey: "subcategories.traktorNested.irrigation.waterPumps",
            icon: "pump",
          },
          OTHER,
        ],
      },
    ],
  },
  /* Jobs – temporarily disabled
  {
    key: "Jobs",
    name: "Jobs",
    icon: "briefcase-outline",
    color: "#DC2626",
    apiPath: CAT_PATHS.jobs,
    subCategories: [
      {
        key: "fullTime",
        name: "Full Time",
        icon: "briefcase-outline",
        nested: [
          { key: "administrationOffice", labelKey: "subcategories.jobsNested.fullTime.administrationOffice", icon: "desk" },
          { key: "itTechnology", labelKey: "subcategories.jobsNested.fullTime.itTechnology", icon: "laptop" },
          { key: "healthcare", labelKey: "subcategories.jobsNested.fullTime.healthcare", icon: "hospital-box-outline" },
          { key: "salesMarketing", labelKey: "subcategories.jobsNested.fullTime.salesMarketing", icon: "chart-bar" },
          { key: "engineeringConstruction", labelKey: "subcategories.jobsNested.fullTime.engineeringConstruction", icon: "hard-hat" },
          OTHER,
        ],
      },
      {
        key: "partTime",
        name: "Part Time",
        icon: "clock-outline",
        nested: [
          { key: "officeAssistant", labelKey: "subcategories.jobsNested.partTime.officeAssistant", icon: "desk" },
          { key: "studentEmployment", labelKey: "subcategories.jobsNested.partTime.studentEmployment", icon: "school-outline" },
          { key: "foodDeliveryRunner", labelKey: "subcategories.jobsNested.partTime.foodDeliveryRunner", icon: "moped-outline" },
          OTHER,
        ],
      },
      {
        key: "freelance",
        name: "Freelance",
        icon: "account-tie-outline",
        nested: [
          { key: "graphicDesigner", labelKey: "subcategories.jobsNested.freelance.graphicDesigner", icon: "palette-outline" },
          { key: "webDeveloper", labelKey: "subcategories.jobsNested.freelance.webDeveloper", icon: "code-tags" },
          { key: "freelanceWriter", labelKey: "subcategories.jobsNested.freelance.freelanceWriter", icon: "pencil-outline" },
          OTHER,
        ],
      },
      { key: "remote", name: "Remote", icon: "home-outline" },
      { key: "internship", name: "Internship", icon: "school-outline" },
    ],
  },
  */
];

export const getCategoryByKey = (key: string): MainCategory | undefined =>
  MAIN_CATEGORIES.find((c) => c.key === key);

export const SUB_I18N_GROUP: Record<string, string> = {
  Marketplace: "marketplace",
  RealEstate: "realEstate",
  Cars: "cars",
  Motorcycles: "motorcycles",
  Boats: "boats",
  farmequipment: "farmEquipment",
  Jobs: "jobs",
};
