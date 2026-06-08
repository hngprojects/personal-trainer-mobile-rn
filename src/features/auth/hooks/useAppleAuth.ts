import { useQueryClient } from '@tanstack/react-query';

import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAppleAuth() {
  const queryClient = useQueryClient();

  return useApiMutation(authApi.appleAuth, {
    onSuccess: ({ user, tokens, isNewUser }) => {
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY as unknown as unknown[] });
      useAuthStore.getState().setSession(tokens, user, { isNewUser, withWelcome: true });
    },
  });
}
