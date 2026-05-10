import { Stack } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

export default function LoginScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scrollable padding edges={['top', 'bottom']}>
        <View style={[styles.header, { gap: spacing.xs, marginBottom: spacing.xl }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Typography style={styles.title}>Welcome back</Typography>
          <Typography style={styles.subtitle}>Log in to continue your journey</Typography>
        </View>
        <LoginForm />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center' },
  logo: { width: 56, height: 56, marginBottom: 8 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: palette.neutral['9'],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    textAlign: 'center',
  },
});
