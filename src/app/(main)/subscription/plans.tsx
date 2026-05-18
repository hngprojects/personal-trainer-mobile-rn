import { useRouter } from 'expo-router';
import React from 'react';

import { SubscriptionPlansScreen } from '@/features/subscription/components/SubscriptionPlansScreen';

export default function SubscriptionPlansRoute() {
  const router = useRouter();

  return (
    <SubscriptionPlansScreen
      step={4}
      totalSteps={5}
      onBack={() => router.back()}
      onSelectPlan={(planId) =>
        router.push({ pathname: '/(main)/subscription/plan-details', params: { planId } } as any)
      }
    />
  );
}
