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

interface DeviceInfo {
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
