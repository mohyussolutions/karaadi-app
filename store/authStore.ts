import { useAuth } from '../hooks/useAuth';
import { useAppSelector, useAppDispatch } from './store';
import { clearCredentials, setCredentials } from './slices/authSlice';
import * as SecureStore from '../util/secureStorage';
import { disconnectSocket, connectSocket } from '../api/sockets/socket.actions';
import type { User } from '../util/types/user.types';

export function useAuthStore() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const loading = useAppSelector((s) => s.auth.loading);
  const dispatch = useAppDispatch();
  const { login, register, logout, loadFromStorage } = useAuth();

  async function setUser(newUser: User | null, newToken?: string) {
    if (newUser && newToken) {
      await SecureStore.setItemAsync('karaadi_token', newToken);
      await SecureStore.setItemAsync('karaadi_user', JSON.stringify(newUser));
      dispatch(setCredentials({ user: newUser, token: newToken }));
      if (newUser.id) connectSocket(newUser.id);
    } else {
      dispatch(clearCredentials());
    }
  }

  async function clearAuth() {
    await SecureStore.deleteItemAsync('karaadi_token');
    await SecureStore.deleteItemAsync('karaadi_user');
    disconnectSocket();
    dispatch(clearCredentials());
  }

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    setUser,
    clearAuth,
    login,
    register,
    logout,
    loadFromStorage,
  };
}
