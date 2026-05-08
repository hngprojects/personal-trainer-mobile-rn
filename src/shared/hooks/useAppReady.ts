import { useEffect, useState } from 'react';

import { secureStorage } from '@/shared/storage/secureStorage';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const { useAuthStore } = await import('@/features/auth/store/auth.store');
        const { useOnboardingStore } = await import('@/features/onboarding/store/onboarding.store');

        const [tokens] = await Promise.all([
          secureStorage.getTokens(),
          useOnboardingStore.getState().loadFromStorage(),
        ]);

        if (tokens) {
          useAuthStore.getState().setTokens(tokens);
        }
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
