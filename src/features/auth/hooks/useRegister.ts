import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useRegister() {
  return useApiMutation(authApi.register, {
    onSuccess: ({ user, tokens }) => {
      useAuthStore.getState().setSession(tokens, user);
    },
  });
}
