import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

import { useAuthStore, WelcomeAnimation } from '@/features/auth';
import { Screen } from '@/shared/components';

const WELCOME_DURATION_MS = 2200;

export default function WelcomeScreen() {
  const isNewUser = useAuthStore((s) => s.isNewUser);
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);
  const dismissWelcome = useAuthStore((s) => s.dismissWelcome);

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissWelcome();
      router.replace('/(main)');
    }, WELCOME_DURATION_MS);
    return () => clearTimeout(timer);
  }, [dismissWelcome]);

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
