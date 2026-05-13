import { useEffect, useState } from 'react';

import { configureGoogleSignin } from '@/shared/api/googleSignin';
import { STORAGE_KEYS } from '@/shared/constants/keys';
import { asyncStorage } from '@/shared/storage/asyncStorage';
import { secureStorage } from '@/shared/storage/secureStorage';
import { loadAppFonts } from '@/shared/theme';

import type { UserProfile } from '@/features/auth';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        configureGoogleSignin();
        const { useAuthStore } = await import('@/features/auth/store/auth.store');
        const { useOnboardingStore } = await import('@/features/onboarding/store/onboarding.store');

        const [tokens, user] = await Promise.all([
          secureStorage.getTokens(),
          asyncStorage.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE),
          useOnboardingStore.getState().loadFromStorage(),
          loadAppFonts(),
        ]);

        useAuthStore.getState().hydrate({ tokens, user });
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setIsReady(true);
      }
    }

    init();
  }, []);

  return { isReady };
}
