import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useGoogleAuth() {
  return useApiMutation(authApi.googleAuth, {
    onSuccess: ({ user, tokens, isNewUser }) => {
      useAuthStore.getState().setSession(tokens, user, { isNewUser, withWelcome: true });
    },
  });
}
