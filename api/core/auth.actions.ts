import { apiClient } from '../client';
import { AUTH_ENDPOINTS } from '../../constants';
import type { User, AuthResponse } from '../../utils/types/user.types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });
  return data;
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.REGISTER, payload);
  return data;
}

export async function confirmAccount(email: string, code: string): Promise<{ message: string }> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.CONFIRM, { email, code });
  return data;
}

export async function resendCode(email: string): Promise<{ message: string }> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.RESEND_CODE, { email });
  return data;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return data;
}

export async function resetPassword(payload: {
  email: string;
  code: string;
  password: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT).catch(() => {});
}

export async function getProfile(): Promise<User | null> {
  try {
    const { data } = await apiClient.post(AUTH_ENDPOINTS.PROFILE);
    return data;
  } catch {
    return null;
  }
}

export async function updateUsername(username: string): Promise<User> {
  const { data } = await apiClient.put(AUTH_ENDPOINTS.UPDATE_USERNAME, { username });
  return data.user ?? data;
}

export async function updatePhone(phone: string): Promise<User> {
  const { data } = await apiClient.put(AUTH_ENDPOINTS.UPDATE_PHONE, { phone });
  return data.user ?? data;
}

export async function updateProfileImage(profileImage: string): Promise<User> {
  const { data } = await apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE_IMAGE, { profileImage });
  return data.user ?? data;
}

export async function updatePushToken(pushToken: string): Promise<void> {
  await apiClient.put(AUTH_ENDPOINTS.UPDATE_PUSH_TOKEN, { pushToken });
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete(AUTH_ENDPOINTS.DELETE_ACCOUNT);
}
