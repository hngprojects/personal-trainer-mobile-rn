export type MediaType = 'image' | 'video';
export type MediaStatus = 'ready' | 'processing' | 'failed';

/**
 * A single organisation-level media row from `GET /media`, normalised for app
 * use (snake_case payload → camelCase, media URL host rewritten for staging).
 */
export interface MediaItem {
  id: string;
  mediaType: MediaType;
  title: string;
  description: string;
  category: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  status: MediaStatus;
}
