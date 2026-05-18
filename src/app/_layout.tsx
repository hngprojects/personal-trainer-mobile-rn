import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
// import { useAuthStore } from '@/features/auth/store/auth.store';
// import { EntryScreen } from '@/features/entry';
// import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { AppProviders } from '@/providers/AppProviders';
import { useAppReady } from '@/shared/hooks/useAppReady';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isReady } = useAppReady();
  // const { isLoggedIn } = useAuthSession();
  // const hasCompleted = useOnboardingStore((s) => s.hasCompleted);
  // const showWelcome = useAuthStore((s) => s.showWelcome);
  // const [entryDone, setEntryDone] = useState(false);

  // Hide splash only AFTER React has painted the navigation tree.
  // useEffect fires post-render/paint, so the correct screen is visible
  // underneath before the splash fades — no blank flash.
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // const handleEntryComplete = useCallback(() => setEntryDone(true), []);

  if (!isReady) return null;

  // DEV BYPASS: skip auth/onboarding and go straight to main
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" options={{ animation: 'fade' }} />
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
