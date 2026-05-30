import { registerAuthStore } from '@/shared/api/client';
import { STORAGE_KEYS } from '@/shared/constants/keys';
import { asyncStorage } from '@/shared/storage/asyncStorage';
import { secureStorage } from '@/shared/storage/secureStorage';
import { createStore } from '@/shared/store/factory';

import type { AuthTokens, UserProfile } from '../api/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isNewUser: boolean;
  showWelcome: boolean;
}

interface SetSessionOptions {
  isNewUser?: boolean;
  withWelcome?: boolean;
}

interface AuthActions {
  setSession: (tokens: AuthTokens, user: UserProfile, opts?: SetSessionOptions) => void;
  setTokens: (tokens: AuthTokens) => void;
  hydrate: (data: { tokens?: AuthTokens | null; user?: UserProfile | null }) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  clearSession: () => void;
  dismissWelcome: () => void;
}

const persistUser = (user: UserProfile | null) => {
  if (user) {
    asyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, user).catch(() => undefined);
  } else {
    asyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE).catch(() => undefined);
  }
};

export const useAuthStore = createStore<AuthState & AuthActions>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isNewUser: false,
  showWelcome: false,

  setSession: (tokens, user, opts) => {
    set({
      ...tokens,
      user,
      isNewUser: opts?.isNewUser ?? false,
      showWelcome: opts?.withWelcome ?? false,
    });
    secureStorage.saveTokens(tokens).catch(() => undefined);
    persistUser(user);
  },

  setTokens: (tokens) => {
    set({ ...tokens });
    secureStorage.saveTokens(tokens).catch(() => undefined);
  },

  hydrate: ({ tokens, user }) => {
    set({
      ...(tokens ?? {}),
      ...(user !== undefined ? { user } : {}),
    });
  },

  updateUser: (patch) => {
    const current = useAuthStore.getState().user;
    if (!current) return;
    const next = { ...current, ...patch };
    set({ user: next });
    persistUser(next);
  },

  clearSession: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isNewUser: false,
      showWelcome: false,
    });
    secureStorage.clearTokens().catch(() => undefined);
    asyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE).catch(() => undefined);
  },

  dismissWelcome: () => set({ showWelcome: false }),
}));

// Register with Axios interceptor (synchronous store access outside React)
registerAuthStore(() => ({
  accessToken: useAuthStore.getState().accessToken,
  refreshToken: useAuthStore.getState().refreshToken,
  setTokens: useAuthStore.getState().setTokens,
  clearSession: useAuthStore.getState().clearSession,
}));
