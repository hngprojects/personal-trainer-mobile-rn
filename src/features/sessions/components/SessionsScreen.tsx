import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

export function SessionsScreen() {
  const { spacing } = useTheme();

  return (
    <Screen scrollable padding={false} edges={['top']} backgroundColor="#FFFFFF">
      <StatusBar style="dark" />

      <View style={[styles.body, { paddingHorizontal: spacing.md, paddingTop: spacing.lg }]}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Typography style={styles.title}>Sessions</Typography>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(150).duration(450)}
          style={[styles.empty, { marginTop: spacing.xxl }]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={32} color={palette.neutral['5']} />
          </View>
          <Typography style={styles.emptyTitle}>No sessions yet</Typography>
          <Typography style={styles.emptyText}>
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
    color: palette.neutral['9'],
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
    backgroundColor: palette.neutral['1'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: palette.neutral['9'],
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    textAlign: 'center',
    lineHeight: 20,
  },
});
