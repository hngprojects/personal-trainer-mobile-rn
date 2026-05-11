import { Redirect, Stack } from 'expo-router';

import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';

export default function OnboardingLayout() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompleted);
  const pendingAuth = useOnboardingStore((s) => s.pendingAuth);

  if (hasCompleted) {
    const target = pendingAuth === 'register' ? '/(auth)/register' : '/(auth)/login';
    return <Redirect href={target} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
