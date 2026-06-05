import type { Ionicons } from '@expo/vector-icons';

// Outreach methods accepted by the backend for both discovery calls
// (sent as `contact_mode` on POST /bookings/discovery) and paid session
// bookings (sent as `session_platform` on POST /bookings). Single source of
// truth so both flows stay in sync.
//
//   zoom_meeting   — backend creates a Zoom link.
//   phone_callback — trainer calls the phone number provided (requires phone).
//   google_meet    — backend creates a Google Meet room.
//   messenger      — trainer reaches out on Facebook Messenger (requires handle).
//   imessage       — iMessage from the trainer (requires phone, E.164).
export type OutreachMethod =
  | 'zoom_meeting'
  | 'phone_callback'
  | 'google_meet'
  | 'messenger'
  | 'imessage';

/** Extra field the backend requires for a given method, if any. */
export type OutreachField = 'phone' | 'messenger' | null;

export interface OutreachOption {
  id: OutreachMethod;
  /** Short title shown on the selection card and summary. */
  name: string;
  /** One-line explanation shown under the title. */
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** When true, render the bundled Zoom logo instead of `icon`. */
  usesZoomLogo?: boolean;
  /** Which extra input this method needs collected. */
  requires: OutreachField;
}

export const OUTREACH_OPTIONS: OutreachOption[] = [
  {
    id: 'zoom_meeting',
    name: 'Zoom Meeting',
    description: "We'll send a Zoom link before your session.",
    icon: 'videocam-outline',
    usesZoomLogo: true,
    requires: null,
  },
  {
    id: 'google_meet',
    name: 'Google Meet',
    description: "We'll send a Google Meet link before your session.",
    icon: 'videocam-outline',
    requires: null,
  },
  {
    id: 'phone_callback',
    name: 'Phone Call',
    description: 'Your trainer calls the number you provide.',
    icon: 'call-outline',
    requires: 'phone',
  },
  {
    id: 'imessage',
    name: 'iMessage',
    description: 'Your trainer messages you on iMessage.',
    icon: 'chatbubble-ellipses-outline',
    requires: 'phone',
  },
  {
    id: 'messenger',
    name: 'Messenger',
    description: 'Your trainer reaches out on Facebook Messenger.',
    icon: 'logo-facebook',
    requires: 'messenger',
  },
];

export function outreachOption(id: OutreachMethod): OutreachOption | undefined {
  return OUTREACH_OPTIONS.find((o) => o.id === id);
}

export function outreachLabel(id: OutreachMethod): string {
  return outreachOption(id)?.name ?? id;
}

export function outreachRequires(id: OutreachMethod): OutreachField {
  return outreachOption(id)?.requires ?? null;
}
