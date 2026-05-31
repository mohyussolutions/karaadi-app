import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null, token?: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  setUser: async (user, token) => {
    if (user && token) {
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    }
    set({ user, token: token ?? null, loading: false });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, token: null, loading: false });
  },

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userJson = await SecureStore.getItemAsync('user');
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ user, token, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
