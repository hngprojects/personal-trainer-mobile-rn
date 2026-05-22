import { create, isAxiosError } from 'axios';

import { env } from '@/shared/constants/env';

import { getJwtType, hasJwtExp, isJwtExpired } from './jwt';
import { ApiError } from './types';

export const client = create({
  baseURL: env.API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Lazily imported to avoid circular deps at module load time
type AuthStateAccessor = () => {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
};

let getAuthState: AuthStateAccessor | null = null;
let refreshPromise: Promise<{ accessToken: string; refreshToken: string }> | null = null;
let rejectedRefreshToken: string | null = null;

export function registerAuthStore(store: AuthStateAccessor) {
  getAuthState = store;
}

client.interceptors.request.use((config) => {
  const token = getAuthState?.().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & {
      _retry?: boolean;
      _skipAuthRefresh?: boolean;
    };

    // Some requests (logout, refresh itself) shouldn't trigger an auto-refresh
    // even on 401 — they need to fail fast so the caller can react.
    if (original?._skipAuthRefresh) {
      return Promise.reject(toApiError(error));
    }

    if (error.response?.status === 401 && !original._retry && getAuthState) {
      original._retry = true;
      const { accessToken, refreshToken, clearSession } = getAuthState();

      if (!accessToken || !refreshToken) {
        clearSession();
        return Promise.reject(toApiError(error));
      }

      const hasValidTokenShape =
        hasJwtExp(accessToken) && hasJwtExp(refreshToken) && getJwtType(refreshToken) === 'refresh';

      if (
        !hasValidTokenShape ||
        refreshToken === rejectedRefreshToken ||
        isJwtExpired(refreshToken)
      ) {
        rejectedRefreshToken = refreshToken;
        clearSession();
        return Promise.reject(toApiError(error));
      }

      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        refreshPromise ??= authApi
          .refreshTokens(refreshToken, accessToken)
          .finally(() => {
            refreshPromise = null;
          });
        const newTokens = await refreshPromise;
        rejectedRefreshToken = null;
        getAuthState().setTokens(newTokens);
        original.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return client(original);
      } catch {
        rejectedRefreshToken = refreshToken;
        getAuthState().clearSession();
        return Promise.reject(toApiError(error));
      }
    }

    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string })?.message ?? error.message;
    return new ApiError(msg, error.response?.status ?? 0);
  }
  return new ApiError('Unknown error', 0);
}
