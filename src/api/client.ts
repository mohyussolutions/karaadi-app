import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { store } from '../store';
import { clearCredentials } from '../store/slices/authSlice';
import { disconnectSocket } from '../services/socketService';
import { API_BASE_URL } from '../constants/endpoints';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('karaadi_token');
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
      await SecureStore.deleteItemAsync('karaadi_token');
      await SecureStore.deleteItemAsync('karaadi_user');
      disconnectSocket();
      store.dispatch(clearCredentials());
    }
    return Promise.reject(error);
  },
);
