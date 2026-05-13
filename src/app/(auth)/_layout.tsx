import { Redirect, Stack } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { useTheme } from '@/shared/theme';

export default function AuthLayout() {
  const { colors } = useTheme();
  const hasCompleted = useOnboardingStore((s) => s.hasCompleted);
  const { isLoggedIn } = useAuthSession();
  const showWelcome = useAuthStore((s) => s.showWelcome);

  if (!hasCompleted) return <Redirect href="/(onboarding)" />;
  if (isLoggedIn) return <Redirect href={showWelcome ? '/welcome' : '/'} />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
