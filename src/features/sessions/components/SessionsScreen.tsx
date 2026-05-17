import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

export function SessionsScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  return (
    <Screen scrollable padding={false} edges={['top']} backgroundColor={colors.background}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.body, { paddingHorizontal: spacing.md, paddingTop: spacing.lg }]}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Typography style={[styles.title, { color: colors.text }]}>Sessions</Typography>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(150).duration(450)}
          style={[styles.empty, { marginTop: spacing.xxl }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
            <Ionicons name="calendar-outline" size={32} color={colors.iconMuted} />
          </View>
          <Typography style={[styles.emptyTitle, { color: colors.text }]}>
            No sessions yet
          </Typography>
          <Typography style={[styles.emptyText, { color: colors.textSecondary }]}>
            Book a session with one of our trainers and it&apos;ll show up here.
          </Typography>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  empty: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
