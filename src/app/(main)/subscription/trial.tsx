import { useRouter } from 'expo-router';
import React from 'react';

import { TrialExplanationScreen } from '@/features/subscription/components/TrialExplanationScreen';

export default function SubscriptionTrialRoute() {
  const router = useRouter();

  return (
    <TrialExplanationScreen
      step={3}
      totalSteps={5}
      onContinue={() => router.push('/(main)/subscription/plans')}
      onSkip={() => router.push('/(main)/subscription/plans')}
    />
  );
}
