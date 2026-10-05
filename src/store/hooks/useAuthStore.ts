import { useAppSelector, useAppDispatch } from "../store";
import {
  clearCredentials,
  clearSession,
  login,
  register,
  logout,
  loadFromStorage,
  saveSession,
  selectAuthLoading,
  selectAuthToken,
  selectUser,
} from "../slices/authSlice";
import { unregisterPushToken } from "../../components/features/notifications/services/notificationService";
import type { RegisterPayload, User } from "../../utils/types";

export function useAuthStore() {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectAuthToken);
  const loading = useAppSelector(selectAuthLoading);
  const dispatch = useAppDispatch();

  const setUser = async (newUser: User | null, newToken?: string) => {
    if (newUser && newToken) await dispatch(saveSession({ user: newUser, token: newToken }));
    else dispatch(clearCredentials());
  };

  const clearAuth = async () => {
    await dispatch(clearSession());
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    setUser,
    clearAuth,
    login: (email: string, password: string) =>
      dispatch(login({ email, password })).unwrap(),
    register: (payload: RegisterPayload) =>
      dispatch(register(payload)).unwrap(),
    logout: async () => {
      await unregisterPushToken();
      return dispatch(logout()).unwrap();
    },
    loadFromStorage: () => dispatch(loadFromStorage()),
  };
}
