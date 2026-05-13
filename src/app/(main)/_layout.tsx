import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '@/features/auth';

export default function MainLayout() {
  const { isLoggedIn } = useAuthSession();

  // Guard: any internal route requires an active session.
  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Per-screen overrides only — expo-router auto-detects the (tabs) group
          and the trainer-profile route. Declaring (tabs) explicitly triggers a
          "no route named (tabs) exists" warning because the bundler flattens
          group folders into the parent's child list. */}
      <Stack.Screen name="trainer-video" options={{ animation: 'fade' }} />
    </Stack>
  );
}
