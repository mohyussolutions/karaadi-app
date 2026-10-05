import { defineMainCategories, toMainCategory } from '../../lib/helpers/category/listingCategory.builders';
import { MAIN_CATEGORY_ICONS } from '../../utils/icons';
import {
  BOATS_CATEGORIES,
  CARS_CATEGORIES,
  FARM_EQUIPMENT_CATEGORIES,
  MARKETPLACE_CATEGORIES,
  MOTORCYCLES_CATEGORIES,
  REAL_ESTATE_CATEGORIES,
} from '../categories/categories';

export const MAIN_CATEGORY_DEFINITIONS = defineMainCategories([
  {
    key: 'Marketplace',
    name: 'Marketplace',
    icon: MAIN_CATEGORY_ICONS.marketplace,
    slug: 'marketplace',
    feeKey: 'marketplace',
    categories: MARKETPLACE_CATEGORIES,
  },
  {
    key: 'RealEstate',
    name: 'Real Estate',
    icon: MAIN_CATEGORY_ICONS.realEstate,
    slug: 'realEstate',
    feeKey: 'realEstate',
    categories: REAL_ESTATE_CATEGORIES,
  },
  {
    key: 'Cars',
    name: 'Cars',
    icon: MAIN_CATEGORY_ICONS.cars,
    slug: 'cars',
    feeKey: 'cars',
    categories: CARS_CATEGORIES,
  },
  {
    key: 'Motorcycles',
    name: 'Motorcycles',
    icon: MAIN_CATEGORY_ICONS.motorcycles,
    slug: 'motorcycles',
    feeKey: 'motorcycles',
    categories: MOTORCYCLES_CATEGORIES,
  },
  {
    key: 'Boats',
    name: 'Boats',
    icon: MAIN_CATEGORY_ICONS.boats,
    slug: 'boats',
    feeKey: 'boats',
    categories: BOATS_CATEGORIES,
  },
  {
    key: 'farmequipment',
    name: 'Farm Equipments',
    label: 'Farm Equipment',
    icon: MAIN_CATEGORY_ICONS.farmEquipment,
    slug: 'farmEquipment',
    feeKey: 'equipment',
    categories: FARM_EQUIPMENT_CATEGORIES,
  },
]);

export const MAIN_CATEGORIES = MAIN_CATEGORY_DEFINITIONS.map(toMainCategory);
