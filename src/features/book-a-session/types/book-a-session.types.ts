// Booking shape for a training session. Field names mirror the call-booking
// draft (platform/date/time) so the shared DateTimeStep from book-a-call can be
// reused with no glue.
export type SessionPlatform = 'zoom' | 'google-meet';

export interface SessionDraft {
  platform: SessionPlatform | null;
  date: Date | null;
  time: string | null;
}
