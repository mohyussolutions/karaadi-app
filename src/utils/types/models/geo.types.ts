export interface GeoEntityBase {
  id?: string;
  _id?: string;
  name: string;
}

export interface GeoCity extends GeoEntityBase {
  region?: string;
}

export interface GeoRegion extends GeoEntityBase {
  cities?: GeoCity[];
}

export interface CityPickerItem {
  id: string;
  name: string;
}

export interface RegionPickerItem extends CityPickerItem {
  cities?: CityPickerItem[];
}

export type FilterRow =
  | { key: string; kind: 'region'; name: string; count: number }
  | { key: string; kind: 'city'; name: string; count: number };

export interface AddCityPayload {
  name: string;
  regionId: string;
}

export interface AddCityResponse {
  success: boolean;
  data: Record<string, unknown>;
}

export type CityFilterRow = Extract<FilterRow, { kind: 'city' }>;
