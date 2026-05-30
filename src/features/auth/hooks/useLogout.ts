import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { accessToken, refreshToken } = useAuthStore.getState();
      try {
        if (refreshToken) {
          await authApi.logout(refreshToken, accessToken);
        }
      } catch {
        // Logout always succeeds locally — server-side invalidation is
        // best-effort. Surface as info (not warn) in dev to avoid alarming
        // logs since the local clearSession() below covers the user.
      }
      useAuthStore.getState().clearSession();
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY as unknown as unknown[] });
    },
  });
}
