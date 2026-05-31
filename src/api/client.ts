import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.karaadi.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-auth-token'] = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    }
    return Promise.reject(error);
  },
);

export function normalizeList<T extends { _id?: string; id?: string }>(arr: T[]): T[] {
  return arr.map((item) => ({
    ...item,
    id: item.id || item._id || '',
    _id: item._id || item.id || '',
  }));
}

export function extractList<T>(result: any): T[] {
  const raw = Array.isArray(result)
    ? result
    : result?.data || result?.items || result?.listings || [];
  return normalizeList<any>(raw);
}
