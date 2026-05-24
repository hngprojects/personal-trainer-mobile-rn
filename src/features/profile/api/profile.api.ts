import { useAuthStore } from '@/features/auth/store/auth.store';
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
const LEGACY_AVATAR_ENDPOINT = '/users/me/profile/picture';
const AVATAR_METHOD = 'POST';

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

interface ApiErrorBody {
  message?: string;
  code?: string;
  errors?: { field?: string; message?: string }[];
}

/**
 * Avatar upload uses fetch rather than the axios client because RN's multipart
 * boundary handling is unreliable through axios. fetch produces a correct
 * multipart body with the boundary auto-set as long as no Content-Type header
 * is provided explicitly.
 */
async function uploadAvatar(file: AvatarFile): Promise<AvatarUploadResult> {
  const accessToken = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const uploadUrls = getAvatarUploadUrls();

  for (const [index, requestUrl] of uploadUrls.entries()) {
    const formData = new FormData();
    formData.append('picture', {
      uri: file.uri,
      type: file.mimeType ?? 'image/jpeg',
      name: file.fileName ?? 'avatar.jpg',
    } as unknown as Blob);

    const response = await fetch(requestUrl, {
      method: AVATAR_METHOD,
      body: formData,
      headers,
    });

    let parsed: ApiEnvelope<RawAvatarUploadResponse> | ApiErrorBody | null = null;
    let responseText: string | null = null;
    try {
      responseText = await response.text();
      parsed = responseText ? JSON.parse(responseText) : null;
    } catch {
      // No JSON body - leave parsed null.
    }

    if (response.ok) {
      const data = (parsed as ApiEnvelope<RawAvatarUploadResponse>).data;
      return {
        avatarUrl: data.avatar_url,
        status: data.status,
      };
    }

    // Try the next URL on any 404 — different servers return different bodies
    // ("page not found", "route not found", a generic Nginx page, even no
    // body at all). Matching a specific phrase was making the fallback skip
    // legitimately-missing endpoints.
    if (response.status === 404 && index < uploadUrls.length - 1) {
      continue;
    }

    const errorBody = parsed as ApiErrorBody | null;
    const message =
      errorBody?.message ??
      errorBody?.errors
        ?.map((item) => item.message)
        .filter(Boolean)
        .join(', ') ??
      `Avatar upload failed (${response.status})`;

    throw new ApiError(message, response.status, errorBody?.code);
  }

  throw new ApiError('Avatar upload failed', 0);
}

function getAvatarUploadUrls() {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, '');
  const rootUrl = baseUrl.replace(/\/api\/v\d+$/, '');
  const urls = [
    `${baseUrl}${AVATAR_ENDPOINT}`,
    `${rootUrl}${AVATAR_ENDPOINT}`,
    `${baseUrl}${LEGACY_AVATAR_ENDPOINT}`,
  ];

  return Array.from(new Set(urls));
}

export const profileApi = { getProfile, updateProfile, uploadAvatar };
