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
  // True when the logged-in account is deactivated (soft-deleted). The user can
  // still authenticate but is blocked on protected routes until they reactivate;
  // drives the post-login reactivation prompt.
  isDeactivated: boolean;
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
  setDeactivated: (value: boolean) => void;
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
  isDeactivated: false,

  setSession: (tokens, user, opts) => {
    set({
      ...tokens,
      user,
      isNewUser: opts?.isNewUser ?? false,
      showWelcome: opts?.withWelcome ?? false,
      // Seed the deactivation flag from the login response when it carries the
      // status; the API interceptor flips it too if a protected route blocks.
      isDeactivated: user.isActive === false,
    });
    secureStorage.saveTokens(tokens).catch(() => undefined);
    persistUser(user);
  },

  setDeactivated: (value) => set({ isDeactivated: value }),

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
      isDeactivated: false,
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
  setDeactivated: useAuthStore.getState().setDeactivated,
}));
