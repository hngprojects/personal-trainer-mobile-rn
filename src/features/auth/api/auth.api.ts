import { client } from '@/shared/api/client';

import type { ApiEnvelope, AuthResponse, AuthTokens, RawAuthData } from './auth.types';

function unwrap(data: RawAuthData): AuthResponse {
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      userType: data.user.user_type,
      profileComplete: data.user.profile_complete,
    },
    tokens: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    },
    isNewUser: data.is_new_user,
    expiresIn: data.expires_in,
  };
}

async function googleAuth(idToken: string): Promise<AuthResponse> {
  const res = await client.post<ApiEnvelope<RawAuthData>>('/auth/google/mobile', {
    id_token: idToken,
  });
  return unwrap(res.data.data);
}

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const res = await client.post<ApiEnvelope<{ access_token: string; refresh_token: string }>>(
    '/auth/refresh',
    { refresh_token: refreshToken },
  );
  return {
    accessToken: res.data.data.access_token,
    refreshToken: res.data.data.refresh_token,
  };
}

export const authApi = { googleAuth, refreshTokens };
