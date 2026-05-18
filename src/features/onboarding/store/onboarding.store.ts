import { STORAGE_KEYS } from '@/shared/constants/keys';
import { asyncStorage } from '@/shared/storage/asyncStorage';
import { createStore } from '@/shared/store/factory';

export type PendingAuth = 'login' | 'register';

interface OnboardingState {
  hasCompleted: boolean;
  isLoading: boolean;
  pendingAuth: PendingAuth;
}

interface OnboardingActions {
  loadFromStorage: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  setPendingAuth: (target: PendingAuth) => void;
}

export const useOnboardingStore = createStore<OnboardingState & OnboardingActions>((set) => ({
  hasCompleted: false,
  isLoading: true,
  pendingAuth: 'login',

  loadFromStorage: async () => {
    const value = await asyncStorage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    set({ hasCompleted: value === true, isLoading: false });
  },

  completeOnboarding: async () => {
    set({ hasCompleted: true });
    await asyncStorage.setItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
  },

  resetOnboarding: async () => {
    set({ hasCompleted: false, pendingAuth: 'login' });
    await asyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  },

  setPendingAuth: (target) => {
    set({ pendingAuth: target });
  },
}));
