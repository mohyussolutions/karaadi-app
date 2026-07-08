import * as SecureStore from '../util/secureStorage';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setCredentials, clearCredentials, setLoading } from '../store/slices/authSlice';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile } from '../api/core/auth.actions';
import { connectSocket, disconnectSocket } from '../api/sockets/socket.actions';
import type { User } from '../util/types/user.types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, loading } = useAppSelector((state) => state.auth);

  async function login(email: string, password: string): Promise<User> {
    const response = await apiLogin(email, password);
    const userData: User = {
      ...(response.user ?? response as any),
      id: response.user?.id || (response as any).id || '',
      _id: response.user?._id || (response as any)._id || response.user?.id || '',
      isAdmin: response.user?.isAdmin ?? false,
      token: response.token,
    };
    const authToken = response.token;
    await SecureStore.setItemAsync('karaadi_token', authToken);
    await SecureStore.setItemAsync('karaadi_user', JSON.stringify(userData));
    dispatch(setCredentials({ user: userData, token: authToken }));
    if (userData.id) connectSocket(userData.id);
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
    await apiLogout();
    await SecureStore.deleteItemAsync('karaadi_token');
    await SecureStore.deleteItemAsync('karaadi_user');
    disconnectSocket();
    dispatch(clearCredentials());
  }

  async function loadFromStorage() {
    dispatch(setLoading(true));
    try {
      const token = await SecureStore.getItemAsync('karaadi_token');
      const userJson = await SecureStore.getItemAsync('karaadi_user');
      if (token && userJson) {
        const userData = JSON.parse(userJson) as User;
        dispatch(setCredentials({ user: userData, token }));
        if (userData.id) connectSocket(userData.id);
        getProfile().then((fresh) => {
          if (fresh) {
            const updated = { ...userData, ...fresh, token };
            dispatch(setCredentials({ user: updated, token }));
            SecureStore.setItemAsync('karaadi_user', JSON.stringify(updated));
          }
        }).catch(() => {});
      } else {
        dispatch(clearCredentials());
      }
    } catch {
      dispatch(clearCredentials());
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loadFromStorage,
  };
}
