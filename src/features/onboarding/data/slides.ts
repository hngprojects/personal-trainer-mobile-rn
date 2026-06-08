import { ViewStyle } from 'react-native';

export type OnboardingCalloutVariant = 'icon' | 'person';

export interface OnboardingCalloutData {
  variant: OnboardingCalloutVariant;
  iconEmoji?: string;
  iconBg?: string;
  initials?: string;
  avatarBg?: string;
  title: string;
  subtitle?: string;
  rating?: number;
  position: ViewStyle;
}

export interface OnboardingSlideData {
  id: string;
  title: string;
  subtitle: string;
  callout: OnboardingCalloutData;
}

export const SLIDES: OnboardingSlideData[] = [
  {
    id: 'consistent',
    title: 'Finally Stay Consistent With Your Workouts',
    subtitle:
      'A real trainer calls you at your scheduled time and guides you through every step. No more excuses.',
    callout: {
      variant: 'icon',
      iconEmoji: '📅',
      iconBg: '#0F2E5C',
      title: 'Session Booked',
      subtitle: '7:00 AM',
      position: { top: '46%', right: -10 },
    },
  },
  {
    id: 'curated',
    title: 'Choose From Curated Expert Trainers',
    subtitle:
      'Certified coaches across strength, mobility, fat loss and HIIT. Find the one who gets you.',
    callout: {
      variant: 'person',
      initials: 'CE',
      avatarBg: '#7E7C78',
      title: 'Charles Effiong',
      rating: 5.0,
      position: { top: '14%', right: -16 },
    },
  },
  {
    id: 'shows-up',
    title: 'Your Trainer Shows Up For You',
    subtitle:
      'Real calls. Real coaching. Someone is counting on you to show up, every single session.',
    callout: {
      variant: 'person',
      initials: 'CE',
      avatarBg: '#7E7C78',
      title: 'Charles Effiong',
      subtitle: 'Trainer guiding you',
      position: { top: '22%', right: -16 },
    },
  },
];
