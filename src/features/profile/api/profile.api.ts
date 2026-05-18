import { useAuthStore } from '@/features/auth';
import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';
import { ApiError } from '@/shared/api/types';
import { env } from '@/shared/constants/env';

import type {
  AvatarUploadResult,
  ProfilePayload,
  RawAvatarUploadResponse,
  RawProfile,
  UpdateProfileRequest,
} from './profile.types';

const PROFILE_ENDPOINT = '/users/me/profile';
const AVATAR_ENDPOINT = '/users/me/profile/picture';

function unwrapProfile(raw: RawProfile): ProfilePayload {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    gender: raw.gender,
    fitnessGoals: raw.fitness_goals,
    fitnessLevel: raw.fitness_level,
    avatarUrl: raw.avatar_url,
    profileComplete: raw.profile_complete,
  };
}

async function getProfile(): Promise<ProfilePayload> {
  const res = await client.get<ApiEnvelope<RawProfile>>(PROFILE_ENDPOINT);
  if (__DEV__) {
    console.log('[profile] GET /users/me/profile →', JSON.stringify(res.data, null, 2));
  }
  return unwrapProfile(res.data.data);
}

async function updateProfile(patch: UpdateProfileRequest): Promise<ProfilePayload> {
  const res = await client.patch<ApiEnvelope<RawProfile>>(PROFILE_ENDPOINT, patch);
  return unwrapProfile(res.data.data);
}

interface AvatarFile {
  uri: string;
  mimeType?: string;
  fileName?: string;
}

/**
 * Avatar upload uses `fetch` rather than the axios client because RN's
 * multipart boundary handling is unreliable through axios — the global
 * `Content-Type: application/json` header on the client interferes with the
 * boundary, leading to silent server-side parse failures. fetch produces a
 * correct multipart body with the boundary auto-set as long as no
 * Content-Type header is provided explicitly.
 */
async function uploadAvatar(file: AvatarFile): Promise<AvatarUploadResult> {
  const formData = new FormData();
  formData.append('picture', {
    uri: file.uri,
    type: file.mimeType ?? 'image/jpeg',
    name: file.fileName ?? 'avatar.jpg',
  } as unknown as Blob);

  const accessToken = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${env.API_BASE_URL}${AVATAR_ENDPOINT}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  let parsed: ApiEnvelope<RawAvatarUploadResponse> | { message?: string } | null = null;
  try {
    parsed = await response.json();
  } catch {
    // No JSON body — leave parsed null.
  }

  if (!response.ok) {
    const message =
      (parsed as { message?: string } | null)?.message ??
      `Avatar upload failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  const data = (parsed as ApiEnvelope<RawAvatarUploadResponse>).data;
  return {
    avatarUrl: data.avatar_url,
    status: data.status,
  };
}

export const profileApi = { getProfile, updateProfile, uploadAvatar };
