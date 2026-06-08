import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { PlanDetailsScreen } from '@/features/subscription/components/PlanDetailsScreen';

export default function SubscriptionPlanDetailsRoute() {
  const router = useRouter();
  const { planId, trainerId, trainerName, trainerImage } = useLocalSearchParams<{
    planId: string;
    trainerId?: string;
    trainerName?: string;
    trainerImage?: string;
  }>();

  return (
    <PlanDetailsScreen
      planId={planId as string}
      trainerId={trainerId}
      trainerName={trainerName}
      trainerImage={trainerImage}
      onBack={() => router.back()}
      // Called only after the purchase is verified by the backend. Continue into
      // the booking flow (Pick Availability → Confirm Booking) for this trainer.
      onSubscribe={() => {
        router.dismissAll();
        if (trainerId) {
          router.replace({ pathname: '/book-a-session', params: { trainerId } } as never);
        } else {
          router.replace('/(main)/(tabs)');
        }
      }}
    />
  );
}
