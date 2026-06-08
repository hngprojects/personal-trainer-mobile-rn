import type { OutreachMethod } from '@/features/bookings';
import type { PhoneCountry } from '@/shared/components';

// Mirrors the call-booking shape so the shared DateTimeStep from book-a-call
// can be reused. `phoneNumber` is required for `phone_callback`/`imessage` and
// `messengerHandle` for `messenger`.
export type SessionPlatform = OutreachMethod;

export interface SessionDraft {
  platform: SessionPlatform | null;
  phoneNumber: string;
  phoneCountry: PhoneCountry;
  messengerHandle: string;
  date: Date | null;
  time: string | null;
}
