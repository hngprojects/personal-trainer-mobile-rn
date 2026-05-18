export type { ApiEnvelope } from '@/shared/api/types';

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
  // Onboarding fields — populated by GET /users/me/profile and the
  // profile-setup PATCH. Optional because the auth response doesn't include them.
  gender?: string | null;
  fitnessGoals?: string[] | null;
  fitnessLevel?: string | null;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
  isNewUser: boolean;
  expiresIn: number;
}

export interface RawAuthData {
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
    profile_complete: boolean;
    // Onboarding-saved fields the backend echoes on login. Optional because
    // older responses or partially-onboarded users may omit them.
    gender?: string | null;
    fitness_goals?: string[] | null;
    fitness_level?: string | null;
    avatar_url?: string | null;
  };
  access_token: string;
  refresh_token: string;
  is_new_user: boolean;
  expires_in: number;
}
