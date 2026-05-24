import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { EntryScreen } from '@/features/entry';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { AppProviders } from '@/providers/AppProviders';
import { useAppReady } from '@/shared/hooks/useAppReady';
import { useTheme } from '@/shared/theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isReady } = useAppReady();
  const { colors } = useTheme();
  const { isLoggedIn } = useAuthSession();
  const hasCompleted = useOnboardingStore((s) => s.hasCompleted);
  const showWelcome = useAuthStore((s) => s.showWelcome);
  const [entryDone, setEntryDone] = useState(false);

  // Hide splash only AFTER React has painted the navigation tree.
  // useEffect fires post-render/paint, so the correct screen is visible
  // underneath before the splash fades — no blank flash.
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  const handleEntryComplete = useCallback(() => setEntryDone(true), []);

  if (!isReady) return null;

  if (!entryDone) {
    return <EntryScreen onComplete={handleEntryComplete} />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      {!hasCompleted && <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />}
      {hasCompleted && !isLoggedIn && (
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      )}
      {isLoggedIn && showWelcome && <Stack.Screen name="welcome" options={{ animation: 'fade' }} />}
      {isLoggedIn && !showWelcome && (
        <Stack.Screen name="profile-setup" options={{ animation: 'fade' }} />
      )}
      {isLoggedIn && !showWelcome && (
        <Stack.Screen name="profile-setup-video" options={{ animation: 'slide_from_bottom' }} />
      )}
      {isLoggedIn && !showWelcome && <Stack.Screen name="(main)" options={{ animation: 'fade' }} />}
      <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="terms-of-service" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
