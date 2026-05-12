import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthResponse, OtpForm, SuccessState, useAuthStore } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

const SUCCESS_HOLD_MS = 1500;

export default function VerifyOtpScreen() {
  const { spacing } = useTheme();
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVerified = (response: AuthResponse) => {
    setShowSuccess(true);
    setTimeout(() => {
      useAuthStore.getState().setSession(response.tokens, response.user);
    }, SUCCESS_HOLD_MS);
  };

  if (showSuccess) {
    return (
      <Screen scrollable padding edges={['top', 'bottom']}>
        <Stack.Screen options={{ headerShown: false }} />
        <SuccessState title="Success" message="Your account has been created successfully" />
      </Screen>
    );
  }

  return (
    <Screen scrollable padding edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { gap: spacing.lg }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.neutral['9']} />
        </Pressable>

        <View style={{ gap: spacing.xs }}>
          <Typography style={styles.title}>We sent you an Email</Typography>
          <Typography style={styles.subtitle}>
            Please enter the code we just sent to your email.
          </Typography>
        </View>

        <OtpForm email={email} onVerified={handleVerified} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { alignSelf: 'flex-start' },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: palette.neutral['9'],
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
  },
});
