import { Stack } from 'expo-router';
import React from 'react';

import { useAuthStore } from '@/features/auth';
import { ProfileSetupVideoScreen } from '@/features/profile-setup/components/ProfileSetupVideoScreen';

export default function ProfileSetupVideoRoute() {
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);

  if (!isLoggedIn) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: true }} />
      <ProfileSetupVideoScreen />
    </>
  );
}
