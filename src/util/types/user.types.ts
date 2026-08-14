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

export interface Session {
  id: string;
  device?: string | null;
  browser?: string | null;
  active?: boolean;
  lastActive?: string | null;
}

export interface LoginEntry {
  id: number;
  device?: string | null;
  browser?: string | null;
  ipAddress?: string | null;
  loggedAt: string;
}
