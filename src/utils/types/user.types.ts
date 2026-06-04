export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  phone?: string;
  phoneVerified?: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSupport: boolean;
  cognitoId?: string;
  token: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  token: string;
  user: User & { accessToken?: string };
}
