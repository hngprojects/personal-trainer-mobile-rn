import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

import type { MediaItem, MediaStatus, MediaType } from '../types/media.types';

// Used when the org media library has no ready videos yet (or the request
// fails) so onboarding / profile-setup never render a black screen.
export const FALLBACK_VIDEO_URL =
  'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4';

const STAGING_MEDIA_HOST = 'https://api.staging.fitcall.me';

interface RawMediaItem {
  id: string;
  media_type?: MediaType;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  object_key?: string | null;
  public_url?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  status?: MediaStatus | null;
}

interface FetchMediaParams {
  type?: MediaType;
  category?: string | null;
  status?: MediaStatus;
  page?: number;
  limit?: number;
}

// MinIO/dev hosts leak through some media URLs; rewrite them to the public
// staging host so the device can actually reach the asset.
function normalizeMediaUrl(value: string | null | undefined): string {
  if (!value) return '';
  if (value.startsWith('http://localhost:9000')) {
    return value.replace('http://localhost:9000', STAGING_MEDIA_HOST);
  }
  if (value.startsWith('http://api.staging.fitcall.me')) {
    return value.replace('http://api.staging.fitcall.me', STAGING_MEDIA_HOST);
  }
  return value;
}

function mapMedia(raw: RawMediaItem): MediaItem {
  return {
    id: raw.id,
    mediaType: raw.media_type ?? 'image',
    title: raw.title ?? '',
    description: raw.description ?? '',
    category: raw.category ?? '',
    url: normalizeMediaUrl(raw.public_url),
    mimeType: raw.mime_type ?? '',
    sizeBytes: raw.size_bytes ?? 0,
    status: raw.status ?? 'ready',
  };
}

/**
 * List org-level media. Defaults to ready items only (matches the backend
 * default) so callers never see half-uploaded rows.
 */
export async function fetchMedia({
  type,
  category,
  status = 'ready',
  page = 1,
  limit = 10,
}: FetchMediaParams = {}): Promise<MediaItem[]> {
  const response = await client.get<ApiEnvelope<RawMediaItem[]>>('/media', {
    params: {
      page,
      limit,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
    },
  });

  return (
    (response.data.data ?? [])
      .map(mapMedia)
      // Drop rows with no usable URL so the player never gets an empty source.
      .filter((item) => Boolean(item.url))
  );
}

/** Convenience wrapper: ready videos from the org library. */
export function fetchMediaVideos(
  params: Omit<FetchMediaParams, 'type'> = {},
): Promise<MediaItem[]> {
  return fetchMedia({ ...params, type: 'video' });
}
