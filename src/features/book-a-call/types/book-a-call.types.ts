export type CallPlatform = 'zoom' | 'google-meet';

export interface CallDraft {
  platform: CallPlatform | null;
  date: Date | null;
  time: string | null;
}
