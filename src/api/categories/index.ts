import { apiClient, extractList } from '../client';
import {
  CARS_ENDPOINTS, BOATS_ENDPOINTS, MOTORCYCLES_ENDPOINTS,
  REAL_ESTATE_ENDPOINTS, FARM_EQUIPMENT_ENDPOINTS,
  MARKETPLACE_ENDPOINTS, JOBS_ENDPOINTS, ITEMS_ENDPOINTS, WANTED_ENDPOINTS,
} from '../urls';
import type { Car, Boat, Motorcycle, RealEstate, FarmEquipment, Marketplace, Job, ListingBase } from '../../types';

async function fetchList<T>(url: string, page = 1, pageSize = 20): Promise<T[]> {
  const { data } = await apiClient.get(url, { params: { page, pageSize } });
  return extractList<T>(data);
}

async function fetchById<T>(url: string): Promise<T> {
  const { data } = await apiClient.get(url);
  return data;
}

export const carsApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<Car>(CARS_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<Car>(CARS_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<Car>) => apiClient.post(CARS_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<Car>) => apiClient.put(CARS_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(CARS_ENDPOINTS.DELETE(id)),
};

export const boatsApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<Boat>(BOATS_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<Boat>(BOATS_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<Boat>) => apiClient.post(BOATS_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<Boat>) => apiClient.put(BOATS_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(BOATS_ENDPOINTS.DELETE(id)),
};

export const motorcyclesApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<Motorcycle>(MOTORCYCLES_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<Motorcycle>(MOTORCYCLES_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<Motorcycle>) => apiClient.post(MOTORCYCLES_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<Motorcycle>) => apiClient.put(MOTORCYCLES_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(MOTORCYCLES_ENDPOINTS.DELETE(id)),
};

export const realEstateApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<RealEstate>(REAL_ESTATE_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<RealEstate>(REAL_ESTATE_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<RealEstate>) => apiClient.post(REAL_ESTATE_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<RealEstate>) => apiClient.put(REAL_ESTATE_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(REAL_ESTATE_ENDPOINTS.DELETE(id)),
};

export const farmEquipmentApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<FarmEquipment>(FARM_EQUIPMENT_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<FarmEquipment>(FARM_EQUIPMENT_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<FarmEquipment>) => apiClient.post(FARM_EQUIPMENT_ENDPOINTS.CREATE, payload),
  delete: (id: string) => apiClient.delete(FARM_EQUIPMENT_ENDPOINTS.DELETE(id)),
};

export const marketplaceApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<Marketplace>(MARKETPLACE_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<Marketplace>(MARKETPLACE_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<Marketplace>) => apiClient.post(MARKETPLACE_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<Marketplace>) => apiClient.put(MARKETPLACE_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(MARKETPLACE_ENDPOINTS.DELETE(id)),
};

export const jobsApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<Job>(JOBS_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<Job>(JOBS_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<Job>) => apiClient.post(JOBS_ENDPOINTS.CREATE, payload),
  update: (id: string, payload: Partial<Job>) => apiClient.put(JOBS_ENDPOINTS.UPDATE(id), payload),
  delete: (id: string) => apiClient.delete(JOBS_ENDPOINTS.DELETE(id)),
};

export const itemsApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<ListingBase>(ITEMS_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<ListingBase>(ITEMS_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<ListingBase>) => apiClient.post(ITEMS_ENDPOINTS.CREATE, payload),
  delete: (id: string) => apiClient.delete(ITEMS_ENDPOINTS.DELETE(id)),
};

export const wantedApi = {
  list: (page?: number, pageSize?: number) =>
    fetchList<ListingBase>(WANTED_ENDPOINTS.LIST, page, pageSize),
  byId: (id: string) => fetchById<ListingBase>(WANTED_ENDPOINTS.BY_ID(id)),
  create: (payload: Partial<ListingBase>) => apiClient.post(WANTED_ENDPOINTS.CREATE, payload),
};
