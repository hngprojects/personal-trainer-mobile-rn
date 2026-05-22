// Mirrors the call-booking shape so the shared DateTimeStep from book-a-call
// can be reused. `phoneNumber` is only required when `platform === 'phone_call'`.
export type SessionPlatform = 'zoom' | 'phone_call';

export interface SessionDraft {
  platform: SessionPlatform | null;
  phoneNumber: string;
  date: Date | null;
  time: string | null;
}
