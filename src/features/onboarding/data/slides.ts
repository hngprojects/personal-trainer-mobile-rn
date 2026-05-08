export interface OnboardingSlideData {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
}

export const SLIDES: OnboardingSlideData[] = [
  {
    id: 'welcome',
    title: 'Welcome to the App',
    subtitle: 'The fastest way to build something your team will love.',
    emoji: '👋',
    accentColor: '#6C63FF',
  },
  {
    id: 'collaborate',
    title: 'Collaborate Seamlessly',
    subtitle: 'Work together in real-time with your entire team.',
    emoji: '🤝',
    accentColor: '#0EA5E9',
  },
  {
    id: 'achieve',
    title: 'Achieve More',
    subtitle: 'Track goals, measure progress, and celebrate every win.',
    emoji: '🚀',
    accentColor: '#22C55E',
  },
];
