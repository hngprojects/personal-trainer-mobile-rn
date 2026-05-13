import { Stack } from 'expo-router';
import React from 'react';

import { useAuthStore } from '@/features/auth';
import { ProfileSetupScreen } from '@/features/profile-setup';

export default function ProfileSetupRoute() {
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);

  // Guard: if somehow opened while logged out, render nothing — the root layout
  // will reroute to (auth) on the next render.
  if (!isLoggedIn) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <ProfileSetupScreen />
    </>
  );
}
