import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfile } from '@/features/profile';
import { Button, LogoRefreshScrollView, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

export function SessionsScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const { refetch, isRefetching } = useProfile();

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />

      <LogoRefreshScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <Animated.View entering={FadeInDown.duration(420)} style={{ paddingTop: spacing.lg }}>
          <Typography style={[styles.title, { color: colors.text }]}>Sessions</Typography>
          <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your upcoming and past sessions will live here.
          </Typography>
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
            Book a call with one of our trainers and it&apos;ll show up here.
          </Typography>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(250).duration(450)}
          style={[styles.cta, { marginTop: spacing.xl }]}
        >
          <Button label="Book a Call" onPress={() => router.push('/book-a-call')} />
        </Animated.View>
      </LogoRefreshScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: 4,
    lineHeight: 18,
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
  cta: {
    paddingHorizontal: 24,
  },
});
