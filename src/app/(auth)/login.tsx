import { Stack } from 'expo-router';
import React from 'react';

import { LoginForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function LoginScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Sign In', headerShown: false }} />
      <Screen scrollable padding>
        <Typography variant="h2" style={{ marginBottom: spacing.xs }}>
          Sign In
        </Typography>
        <Typography variant="body1" style={{ marginBottom: spacing.xl }}>
          Use{' '}
          <Typography variant="body1" style={{ fontWeight: '600' }}>
            jeffery@logickoder.dev
          </Typography>{' '}
          /{' '}
          <Typography variant="body1" style={{ fontWeight: '600' }}>
            Password1
          </Typography>{' '}
          to try it out.
        </Typography>
        <LoginForm />
      </Screen>
    </>
  );
}
