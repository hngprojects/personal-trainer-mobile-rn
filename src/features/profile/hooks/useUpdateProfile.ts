import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth';
import { useApiMutation } from '@/shared/api/hooks';

import { profileApi } from '../api/profile.api';
import type { UpdateProfileRequest } from '../api/profile.types';
import { PROFILE_QUERY_KEY } from './useProfile';

/**
 * PATCHes /users/me/profile with the given fields (snake_case body matching
 * the API contract) and pushes the resulting profile into the auth store.
 *
 * Callers should map their local enum values to API values via the helpers
 * in `profile.types.ts` before calling this hook.
 */
export function useUpdateProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useApiMutation(async (patch: UpdateProfileRequest) => profileApi.updateProfile(patch), {
    onSuccess: (profile) => {
      updateUser({
        name: profile.name,
        gender: profile.gender,
        fitnessGoals: profile.fitnessGoals,
        fitnessLevel: profile.fitnessLevel,
        avatarUrl: profile.avatarUrl,
        profileComplete: profile.profileComplete,
      });
      queryClient.setQueryData(PROFILE_QUERY_KEY as unknown as unknown[], profile);
    },
  });
}
