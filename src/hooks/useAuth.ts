import { useAuthStore } from '../store/authStore';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';
import type { User } from '../types';

export function useAuth() {
  const { user, token, loading, setUser, clearAuth } = useAuthStore();

  async function login(email: string, password: string): Promise<User> {
    const response = await apiLogin(email, password);
    const userData = response.user ?? (response as any);
    const authToken = response.token ?? userData.token;
    await setUser(userData, authToken);
    return userData;
  }

  async function register(payload: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return apiRegister(payload);
  }

  async function logout() {
    try {
      await apiLogout();
    } catch {}
    await clearAuth();
  }

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
