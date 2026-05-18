import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import { PlanDetailsScreen } from '@/features/subscription/components/PlanDetailsScreen';

export default function SubscriptionPlanDetailsRoute() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();

  return (
    <PlanDetailsScreen
      planId={planId as string}
      onBack={() => router.back()}
      onSubscribe={() => {
        Alert.alert('Subscribed!', 'Welcome to your 7-day trial.');
        router.dismissAll();
        router.replace('/(main)/(tabs)');
      }}
    />
  );
}
