import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from '@/shared/components';

import { useUploadAvatar } from './useUploadAvatar';

/**
 * Composes the avatar picker UX:
 *  1. Asks for media-library permission (graceful if denied)
 *  2. Opens the picker (square crop, ~0.8 quality)
 *  3. Optimistically swaps the auth-store avatarUrl to the local file:// URI
 *     so the new image renders instantly while the upload is in flight.
 *  4. Hands the chosen asset to useUploadAvatar; on success the URI is
 *     replaced with the CDN URL the server returned. On failure we revert
 *     to whatever was there before so the UI doesn't lie.
 */
export function usePickAndUploadAvatar() {
  const upload = useUploadAvatar();

  const pick = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.error('We need photo access to set your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const previousAvatar = useAuthStore.getState().user?.avatarUrl ?? null;

    // Instant visual feedback — show the chosen image before the network
    // round-trip completes. The CDN URL replaces this on upload success.
    useAuthStore.getState().updateUser({ avatarUrl: asset.uri });

    upload.mutate(
      {
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName ?? undefined,
      },
      {
        onError: () => {
          // Roll back the optimistic local URI so the avatar reflects reality.
          useAuthStore.getState().updateUser({ avatarUrl: previousAvatar });
          toast.error("We couldn't upload that image. Please try again.");
        },
      },
    );
  }, [upload]);

  return {
    pick,
    isUploading: upload.isPending,
  };
}
