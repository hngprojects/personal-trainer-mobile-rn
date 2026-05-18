import { Redirect, Stack } from 'expo-router';
import React from 'react';

import { useAuthStore } from '@/features/auth';
import { ProfileSetupScreen } from '@/features/profile-setup';

export default function ProfileSetupRoute() {
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);
  const profileComplete = useAuthStore((s) => s.user?.profileComplete);

  // Guard: if somehow opened while logged out, render nothing — the root layout
  // will reroute to (auth) on the next render.
  if (!isLoggedIn) return null;

  // Guard: once the user's profile is complete the onboarding flow is one-shot.
  // Direct-nav / refresh / deep-link to /profile-setup bounces straight to main.
  if (profileComplete) return <Redirect href="/" />;

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <ProfileSetupScreen />
    </>
  );
}
