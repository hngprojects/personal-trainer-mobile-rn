import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { ScreenHeader } from './ScreenHeader';

interface ComingSoonScreenProps {
  title: string;
  message?: string;
}

export function ComingSoonScreen({
  title,
  message = "We're putting the finishing touches on this feature.",
}: ComingSoonScreenProps) {
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={statusBarStyle} />
      <ScreenHeader title={title} />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(320)}
          style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}
        >
          <Ionicons name="notifications-outline" size={34} color={colors.primary} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(80).duration(340)} style={styles.copy}>
          <Typography style={[styles.title, { color: colors.text }]}>Coming Soon</Typography>
          <Typography style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Typography>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    marginTop: 18,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  message: {
    marginTop: 8,
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 20,
    textAlign: 'center',
  },
});
