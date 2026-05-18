import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth';
import { useApiMutation } from '@/shared/api/hooks';

import { profileApi } from '../api/profile.api';
import type { ProfilePayload } from '../api/profile.types';
import { PROFILE_QUERY_KEY } from './useProfile';

export interface UploadAvatarInput {
  uri: string;
  mimeType?: string;
  fileName?: string;
}

/**
 * POSTs a profile picture to /users/me/profile/picture.
 *
 * The endpoint returns 202 with the URL the avatar will eventually be served
 * from; the actual S3 upload + user-record update happens asynchronously in
 * a background worker. We:
 *
 *   1. Optimistically write the returned URL into `useAuthStore.user.avatarUrl`
 *      so the UI updates immediately.
 *   2. Patch the in-memory react-query cache with the new URL so the next
 *      consumer sees it without a network round-trip.
 *
 * We deliberately DO NOT invalidate `PROFILE_QUERY_KEY` on success — an
 * immediate refetch races the backend worker and frequently returns
 * `avatar_url: null`, which would clobber our optimistic value. The query's
 * normal 5-minute staleTime handles eventual reconciliation, and any explicit
 * pull-to-refresh / mount of `useProfile` will pick up the durable URL once
 * the backend has caught up.
 */
export function useUploadAvatar() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useApiMutation(
    async (input: UploadAvatarInput) =>
      profileApi.uploadAvatar({
        uri: input.uri,
        mimeType: input.mimeType,
        fileName: input.fileName,
      }),
    {
      onSuccess: ({ avatarUrl }) => {
        updateUser({ avatarUrl });
        queryClient.setQueryData<ProfilePayload | undefined>(
          PROFILE_QUERY_KEY as unknown as unknown[],
          (old) => (old ? { ...old, avatarUrl } : old),
        );
      },
    },
  );
}
