import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';

import { useAuthStore, WelcomeAnimation } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { Screen } from '@/shared/components';

const WELCOME_DURATION_MS = 2200;

export default function WelcomeScreen() {
  const isNewUser = useAuthStore((s) => s.isNewUser);
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);
  const dismissWelcome = useAuthStore((s) => s.dismissWelcome);
  const cachedProfileComplete = useAuthStore((s) => s.user?.profileComplete);

  // Kick off the /users/me/profile fetch in parallel with the animation so the
  // server's view of profileComplete is ready by the time we redirect.
  const profileQuery = useProfile();
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationDone(true), WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animationDone) return;
    // Wait for the profile fetch to settle before deciding. On error, fall back
    // to whatever profileComplete the auth response gave us.
    if (profileQuery.isLoading) return;

    const profileComplete = profileQuery.data?.profileComplete ?? cachedProfileComplete ?? false;

    dismissWelcome();
    router.replace(profileComplete ? '/' : '/profile-setup');
  }, [
    animationDone,
    profileQuery.isLoading,
    profileQuery.data,
    cachedProfileComplete,
    dismissWelcome,
  ]);

  // Guard: if somehow opened while logged out, bounce back to auth.
  if (!isLoggedIn) {
    return null;
  }

  return (
    <Screen padding={false} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <StatusBar style="dark" />
      <WelcomeAnimation isNewUser={isNewUser} />
    </Screen>
  );
}
