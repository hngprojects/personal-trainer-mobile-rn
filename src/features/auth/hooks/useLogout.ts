import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      try {
        if (refreshToken) {
          await authApi.logout(refreshToken);
        }
      } catch (err) {
        // Logout always succeeds locally — server-side invalidation is
        // best-effort. Surface as info (not warn) in dev to avoid alarming
        // logs since the local clearSession() below covers the user.
        if (__DEV__) console.info('[useLogout] server logout skipped:', err);
      }
      useAuthStore.getState().clearSession();
    },
  });
}
