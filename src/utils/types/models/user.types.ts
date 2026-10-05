import type { MutableRefObject } from 'react';
import type { UseHomeFeedResult } from '../hooks/useFeed.types';

export type AuthUser = UseHomeFeedResult['user'];

export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  phone?: string;
  phoneVerified?: boolean;
  hidePhone?: boolean;
  isAdmin: boolean;
  cognitoId?: string;
  token: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  token: string;
  user: User & { accessToken?: string };
}

export type LoginResponse = AuthResponse & Partial<User>;

export interface DeviceInfo {
  device?: string | null;
  browser?: string | null;
}

export interface Session extends DeviceInfo {
  id: string;
  active?: boolean;
  lastActive?: string | null;
}

export interface LoginEntry extends DeviceInfo {
  id: number;
  ipAddress?: string | null;
  loggedAt: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  key?: string;
}

export interface MessageResponse {
  message: string;
}

export interface IdentifiedUser {
  id: string;
}

export type ResetPasswordKey = ResetPasswordResult['key'];

export type IdentifiedUserRef = MutableRefObject<IdentifiedUser | null>;
