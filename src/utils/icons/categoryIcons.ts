import type { IconGroupMap, IconMap, MCIcon, NestedIconGroupMap } from "../types";

export const OTHER_SUBCATEGORY_ICON: MCIcon = "dots-horizontal-circle-outline";

export const MAIN_CATEGORY_ICONS = {
  marketplace: "sofa-outline",
  realEstate: "home-outline",
  cars: "car-outline",
  motorcycles: "motorbike",
  boats: "sail-boat",
  farmEquipment: "tractor",
} as const satisfies IconMap;

export const CATEGORY_ICONS = {
  marketplace: {
    antiques: "palette",
    electronics: "television",
    animalAndSupplies: "paw-outline",
    sportsAndOutdoors: "soccer",
    furniture: "sofa-outline",
    fashion: "tshirt-crew-outline",
    education: "school-outline",
  },
  realEstate: {
    forRent: "home-outline",
    forSale: "currency-usd",
    landForSale: "terrain",
    farmForSale: "barn",
    commercial: "office-building-outline",
  },
  cars: {
    carsForSale: "car-side",
    leaseCars: "car-key",
    trailers: "truck-trailer",
    carParts: "tools",
    truck: "truck",
    electricCars: "car-electric-outline",
    buses: "bus",
  },
  motorcycles: {
    forSale: "motorbike",
    forRent: "car-key",
    spareParts: "tools",
    other: "toolbox-outline",
  },
  boats: {
    boatsForSale: "sail-boat",
    boatsForRent: "ferry",
    boatEnginesForSale: "engine-outline",
    boatParts: "tools",
  },
  farmEquipment: {
    tractor: "tractor",
    tools: "tools",
    fertilizerSpreader: "spray-bottle",
    harvester: "grain",
    plow: "shovel",
    irrigation: "water-outline",
  },
} as const satisfies IconGroupMap;

export const SUBCATEGORY_ICONS = {
  marketplace: {
    antiques: {
      bowls: "bowl",
      parts: "puzzle-outline",
      coffeeService: "coffee-outline",
      porcelain: "cup",
      vintage: "clock-time-four-outline",
    },
    electronics: {
      mobilePhones: "cellphone",
      laptopsComputers: "laptop",
      tvsAccessories: "television",
      camerasPhotography: "camera-outline",
      homeAppliances: "washing-machine",
    },
    animalAndSupplies: {
      camels: "paw",
      goats: "paw-outline",
      cattle: "cow",
      sheep: "sheep",
      horses: "horse-variant",
      donkeys: "donkey",
      poultry: "turkey",
      feed: "grain",
      vetSupplies: "needle",
      accessories: "tag-outline",
    },
    sportsAndOutdoors: {
      gymEquipment: "dumbbell",
      bicycles: "bicycle",
      sportingGoods: "basketball",
      campingGear: "tent",
      toys: "puzzle",
    },
    furniture: {
      sofasCouches: "sofa-outline",
      bedsMattresses: "bed-outline",
      tablesDesks: "table-furniture",
      kitchenFurnishings: "stove",
    },
    fashion: {
      mensClothing: "tshirt-crew-outline",
      womensClothing: "hanger",
      shoesFootwear: "shoe-heel",
      bagsWallets: "bag-personal-outline",
    },
    education: {
      books: "book-open-variant",
      library: "library",
      schoolSupplies: "pencil-box-outline",
      stationery: "notebook-outline",
    },
  },
  realEstate: {
    forRent: {
      apartmentFlat: "office-building-outline",
      houseVilla: "home-outline",
      commercialOffice: "store-outline",
      warehouseStorage: "warehouse",
      singleRoom: "door-open",
    },
    forSale: {
      newHouseVilla: "home-plus-outline",
      usedHouseVilla: "home-outline",
      apartmentFlatForSale: "office-building-outline",
      completedBuilding: "office-building",
    },
    landForSale: {
      residentialLand: "land-plots",
      commercialLand: "store-outline",
      industrialLand: "factory",
    },
    farmForSale: {
      agriculturalLand: "sprout-outline",
      livestockFarm: "cow",
      treeForestFarms: "tree-outline",
    },
    commercial: {
      retailSpaceShop: "store-outline",
      hotelGuesthouse: "bed-outline",
      commercialBuilding: "office-building",
      largeWarehouse: "warehouse",
    },
  },
  cars: {
    carsForSale: {
      sedan: "car-outline",
      suv: "car-sports",
      hatchback: "car-outline",
      convertible: "car-convertible",
      minivan: "van-passenger",
    },
    lease: {
      sedanLease: "car-outline",
      suvLease: "car-sports",
      vanMinibusLease: "van-passenger",
      truckPickupLease: "truck-outline",
      otherLeaseVehicles: "car-key",
    },
    trailers: {
      trailerSpareParts: "wrench-outline",
      heavyDutyTrailer: "truck-trailer",
      otherTrailers: "dots-horizontal-circle-outline",
    },
    parts: {
      engines: "engine-outline",
      tiresRims: "tire",
      bodyParts: "car-wrench",
    },
    trucks: {
      pickupTruck: "truck-outline",
      heavyTruck: "truck",
      truckSpareParts: "wrench-outline",
      flatbedTankTruck: "tanker-truck",
      otherTrucks: "dots-horizontal-circle-outline",
    },
    electric: {
      electricSedan: "car-electric-outline",
      electricSUV: "car-electric-outline",
      otherElectricCar: "car-key",
    },
    buses: {
      coachBuses: "bus-double-decker",
      minibuses: "van-passenger",
      schoolBuses: "bus-school",
      cityBuses: "bus",
    },
  },
  motorcycles: {
    forSale: {
      motorcycle: "motorbike",
      vespa: "motorbike",
      bajaj: "motorbike",
      sportBikes: "bicycle",
      cargo: "truck-cargo-container",
    },
    forRent: {
      motorcycleRental: "motorbike",
      vespaRental: "motorbike",
      cargoMotorcycleRental: "truck-cargo-container",
      bajajForRent: "motorbike",
      cargoBajajRental: "truck-cargo-container",
      dailyBajajRental: "motorbike",
    },
    parts: {
      motorcycleEngines: "engine-outline",
      tiresRims: "tire",
      protectiveGear: "shield-outline",
      bajajEngines: "engine-outline",
      bajajBodyParts: "wrench-outline",
    },
    other: {
      miscellaneousEquipment: "toolbox-outline",
    },
  },
  boats: {
    boatsForSale: {
      fishingBoat: "fish",
      leisureYacht: "sail-boat",
      sailboat: "sail-boat",
      speedboat: "ferry",
    },
    boatsForRent: {
      fishingBoatRental: "fish",
      yachtCharter: "sail-boat",
    },
    engines: {
      outboardEngine: "engine-outline",
      inboardEngine: "engine-outline",
      usedEngine: "wrench-outline",
    },
    parts: {
      engineParts: "wrench-outline",
      navigationEquipment: "compass-outline",
      safetyGear: "shield-outline",
    },
  },
  farmEquipment: {
    tractorForSale: {
      newTractor: "tractor",
      usedTractor: "tractor",
    },
    farmTools: {
      plowTillageEquipment: "shovel",
      seedingEquipment: "seed-outline",
      harvestingEquipment: "corn",
    },
    fertilizerSpreader: {
      mountedSpreader: "spray-bottle",
      towedSpreader: "spray-bottle",
    },
    grainHarvester: {
      selfPropelledHarvester: "tractor",
      pullTypeHarvester: "tractor",
    },
    plow: {
      moldboardPlow: "shovel",
      discPlow: "shovel",
      subsoilPlow: "shovel",
    },
    irrigation: {
      dripIrrigation: "water-outline",
      sprinklerIrrigation: "sprinkler",
      floodIrrigation: "waves",
      waterPumps: "pump",
    },
  },
} as const satisfies NestedIconGroupMap;
