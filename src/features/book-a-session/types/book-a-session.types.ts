import type { PhoneCountry } from '@/shared/components';

// Mirrors the call-booking shape so the shared DateTimeStep from book-a-call
// can be reused. `phoneNumber` is only required when `platform === 'whatsapp'`.
export type SessionPlatform = 'zoom' | 'whatsapp';

export interface SessionDraft {
  platform: SessionPlatform | null;
  phoneNumber: string;
  phoneCountry: PhoneCountry;
  date: Date | null;
  time: string | null;
}
