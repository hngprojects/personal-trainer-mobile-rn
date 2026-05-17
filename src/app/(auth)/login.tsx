import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AuthForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

export default function LoginScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={statusBarStyle} />
      <Screen scrollable padding edges={['top', 'bottom']}>
        <View style={[styles.header, { gap: spacing.xs, marginBottom: spacing.xl }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Typography style={[styles.title, { color: colors.text }]}>Welcome back</Typography>
          <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue your journey
          </Typography>
        </View>
        <AuthForm variant="signin" />
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
