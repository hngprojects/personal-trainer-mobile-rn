import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useApiMutation } from '@/shared/api/hooks';

import { profileApi } from '../api/profile.api';
import type { ProfilePayload, UpdateProfileRequest } from '../api/profile.types';
import { getProfileQueryKey } from './useProfile';

interface MutationContext {
  userId: string | undefined;
}

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

  return useApiMutation<ProfilePayload, UpdateProfileRequest, MutationContext>(
    async (patch) => profileApi.updateProfile(patch),
    {
      // Capture the identity of the user at the moment the mutation kicks
      // off. If the user logs out / switches accounts before the request
      // resolves, onSuccess can compare against the current store and bail
      // out so the response doesn't pollute the new account's state.
      onMutate: () => ({ userId: useAuthStore.getState().user?.id }),
      onSuccess: (profile, _patch, context) => {
        const currentUserId = useAuthStore.getState().user?.id;
        if (context?.userId && currentUserId !== context.userId) {
          return;
        }
        updateUser({
          name: profile.name,
          gender: profile.gender,
          fitnessGoals: profile.fitnessGoals,
          fitnessLevel: profile.fitnessLevel,
          avatarUrl: profile.avatarUrl,
          profileComplete: profile.profileComplete,
        });
        queryClient.setQueryData(
          getProfileQueryKey(context?.userId) as unknown as unknown[],
          profile,
        );
      },
    },
  );
}
