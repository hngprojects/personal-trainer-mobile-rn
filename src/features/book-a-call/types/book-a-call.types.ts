export type CallContactMode = 'zoom_meeting' | 'phone_callback';

export interface CallDraft {
  contactMode: CallContactMode | null;
  phoneNumber: string;
  date: Date | null;
  time: string | null;
}
