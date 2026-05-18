import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AuthForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

export default function RegisterScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={statusBarStyle} />
      <Screen scrollable padding edges={['top', 'bottom']}>
        <View style={styles.center}>
          <View style={[styles.header, { gap: spacing.xs, marginBottom: spacing.xl }]}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            <Typography style={[styles.title, { color: colors.text }]}>
              Create your account
            </Typography>
            <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
              Let&apos;s get you started in a few minutes
            </Typography>
          </View>
          <AuthForm variant="signup" />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
  },
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
