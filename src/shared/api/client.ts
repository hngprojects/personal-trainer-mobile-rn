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
// In-flight refresh, scoped to the refresh token that started it. If the user
// signs out and signs back in (or another user logs in) while a refresh is
// pending, the new session will have a different refresh token and we must
// NOT let the stale refresh's result overwrite the new session's tokens.
let refreshPromise: {
  forToken: string;
  promise: Promise<{ accessToken: string; refreshToken: string }>;
} | null = null;
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

        // If another request already refreshed while we were paused on the
        // dynamic import, skip refreshing and just retry with the current
        // access token. Without this, we'd refresh again using the stale
        // refreshToken captured above — which the server has already rotated.
        const currentRefreshToken = getAuthState().refreshToken;
        if (currentRefreshToken && currentRefreshToken !== refreshToken) {
          const currentAccessToken = getAuthState().accessToken;
          if (currentAccessToken) {
            original.headers.Authorization = `Bearer ${currentAccessToken}`;
            return client(original);
          }
        }

        // Reuse an in-flight refresh only if it belongs to the same refresh
        // token we'd be sending. A pending refresh from a previous session is
        // not safe to await here.
        if (!refreshPromise || refreshPromise.forToken !== refreshToken) {
          refreshPromise = {
            forToken: refreshToken,
            promise: authApi.refreshTokens(refreshToken, accessToken).finally(() => {
              // Only clear the slot if no newer refresh has taken its place.
              if (refreshPromise?.forToken === refreshToken) {
                refreshPromise = null;
              }
            }),
          };
        }
        const refreshForToken = refreshPromise.forToken;
        const newTokens = await refreshPromise.promise;

        // Between starting the refresh and awaiting its result, the session
        // may have been cleared or replaced (logout / account switch). If the
        // current refresh token no longer matches the one we refreshed
        // against, discard the result — calling setTokens here would clobber
        // the new session with stale credentials.
        const currentAfterRefresh = getAuthState().refreshToken;
        if (currentAfterRefresh !== refreshForToken) {
          return Promise.reject(toApiError(error));
        }

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
