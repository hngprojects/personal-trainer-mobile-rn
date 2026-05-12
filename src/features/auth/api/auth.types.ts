export type SocialProvider = 'apple' | 'google';

export interface GoogleAuthRequest {
  id_token: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  userType: string;
  profileComplete: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
  expiresIn: number;
}

// Raw envelope returned by the backend. All endpoints follow this shape; the
// API layer unwraps `data` and converts snake_case → camelCase before exposing
// `AuthResponse` to the rest of the app.
export interface ApiEnvelope<T> {
  status: string;
  message: string;
  code: string;
  data: T;
  meta?: string;
}

export interface RawAuthData {
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
    profile_complete: boolean;
  };
  access_token: string;
  refresh_token: string;
  is_new_user: boolean;
  expires_in: number;
}
