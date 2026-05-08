import { Stack } from 'expo-router';
import React from 'react';

import { RegisterForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function RegisterScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Create Account' }} />
      <Screen scrollable padding>
        <Typography variant="h2" style={{ marginBottom: spacing.xs }}>
          Create Account
        </Typography>
        <Typography variant="body1" style={{ marginBottom: spacing.xl }}>
          Join and start building with your team.
        </Typography>
        <RegisterForm />
      </Screen>
    </>
  );
}
