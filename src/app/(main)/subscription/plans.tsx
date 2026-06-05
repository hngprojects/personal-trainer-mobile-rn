import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { SubscriptionPlansScreen } from '@/features/subscription/components/SubscriptionPlansScreen';

export default function SubscriptionPlansRoute() {
  const router = useRouter();
  const { trainerId, trainerName, trainerImage } = useLocalSearchParams<{
    trainerId?: string;
    trainerName?: string;
    trainerImage?: string;
  }>();

  return (
    <SubscriptionPlansScreen
      step={1}
      totalSteps={1}
      trainerName={trainerName}
      trainerImage={trainerImage}
      onBack={() => router.back()}
      onSelectPlan={(planId) =>
        router.push({
          pathname: '/(main)/subscription/plan-details',
          params: { planId, trainerId, trainerName, trainerImage },
        } as never)
      }
    />
  );
}
