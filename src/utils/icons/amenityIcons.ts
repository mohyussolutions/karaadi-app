import type { StringMap } from "../types";

export const AMENITY_ICONS: StringMap = {
  swimmingPool: "pool",
  gym: "dumbbell",
  security: "shield-check-outline",
  elevator: "elevator",
  generator: "lightning-bolt",
  waterSupply: "water",
  airConditioning: "snowflake",
  garden: "flower-outline",
  balcony: "home-outline",
  parking: "parking",
};

export const AMENITY_KEYS = Object.keys(AMENITY_ICONS);
