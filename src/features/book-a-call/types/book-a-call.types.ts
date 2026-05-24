import type { PhoneCountry } from '@/shared/components';

export type CallContactMode = 'zoom_meeting' | 'phone_callback';

export interface CallDraft {
  contactMode: CallContactMode | null;
  phoneNumber: string;
  phoneCountry: PhoneCountry;
  date: Date | null;
  time: string | null;
}
