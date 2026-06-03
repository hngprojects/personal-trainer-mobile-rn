import { useQuery } from '@tanstack/react-query';

import { fetchMediaVideos } from '../api/media.api';

interface UseMediaVideosOptions {
  category?: string | null;
  limit?: number;
}

/** Ready videos from the org-level media library. */
export function useMediaVideos({ category, limit = 10 }: UseMediaVideosOptions = {}) {
  return useQuery({
    queryKey: ['media', 'videos', category ?? 'all', limit],
    queryFn: () => fetchMediaVideos({ category, limit }),
    // Org media changes rarely; keep it cached so revisiting onboarding /
    // profile-setup doesn't re-hit the network.
    staleTime: 5 * 60 * 1000,
  });
}
