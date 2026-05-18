import { useRouter } from 'expo-router';
import React from 'react';

import { TestimonialScreen } from '@/features/subscription/components/TestimonialScreen';

export default function SubscriptionTestimonialRoute() {
  const router = useRouter();

  return (
    <TestimonialScreen
      step={2}
      totalSteps={5}
      onContinue={() => router.push('/(main)/subscription/trial')}
      onSkip={() => router.push('/(main)/subscription/plans')}
      onBack={() => router.back()}
    />
  );
}
