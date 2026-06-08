import type { OutreachMethod } from '@/features/bookings';
import type { PhoneCountry } from '@/shared/components';

export type CallContactMode = OutreachMethod;

export interface CallDraft {
  contactMode: CallContactMode | null;
  phoneNumber: string;
  phoneCountry: PhoneCountry;
  messengerHandle: string;
  date: Date | null;
  time: string | null;
}
