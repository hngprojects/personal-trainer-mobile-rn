import { useRouter } from 'expo-router';
import React from 'react';

import { IntroScreen } from '@/features/subscription/components/IntroScreen';

export default function SubscriptionIntroRoute() {
  const router = useRouter();

  return (
    <IntroScreen
      step={1}
      totalSteps={5}
      onContinue={() => router.push('/(main)/subscription/testimonials')}
      onSkip={() => router.push('/(main)/subscription/plans')}
    />
  );
}
