import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { useProfileSetupSubmit } from '../hooks/useProfileSetupSubmit';
import { TOTAL_STEPS, useProfileSetupStore } from '../store/profile-setup.store';
import { BackButton } from './BackButton';
import { ProfileSetupPager } from './ProfileSetupPager';
import { ProfileStepProgress } from './ProfileStepProgress';

interface StepCopy {
  title: string;
  subtitle: string;
}

const STEPS: StepCopy[] = [
  {
    title: 'Complete your profile',
    subtitle: 'Just a few quick details so we can set up your training experience.',
  },
  {
    title: 'What are your fitness goals?',
    subtitle: 'Select at least 3 goals that inspire you.',
  },
  {
    title: 'Choose your fitness level',
    subtitle: 'Pick a level that matches your current abilities.',
  },
  {
    title: 'Your Personalized Fitness Journey Starts Here.',
    subtitle: 'Our expert trainers will guide you every step of the way',
  },
];

const MIN_GOALS = 3;

export function ProfileSetupScreen() {
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const step = useProfileSetupStore((s) => s.step);
  const name = useProfileSetupStore((s) => s.draft.name);
  const gender = useProfileSetupStore((s) => s.draft.gender);
  const goalsCount = useProfileSetupStore((s) => s.draft.goals.length);
  const fitnessLevel = useProfileSetupStore((s) => s.draft.fitnessLevel);
  const prev = useProfileSetupStore((s) => s.prev);
  const next = useProfileSetupStore((s) => s.next);
  const { submit, isSubmitting } = useProfileSetupSubmit();

  const valid = useMemo(() => {
    switch (step) {
      case 0:
        return name.trim().length > 1 && gender !== null;
      case 1:
        return goalsCount >= MIN_GOALS;
      case 2:
        return fitnessLevel !== null;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, name, gender, goalsCount, fitnessLevel]);

  const isLast = step === TOTAL_STEPS - 1;
  const isFirst = step === 0;
  const canSkip = step === 1;
  const handleContinue = isLast ? submit : next;
  const buttonLabel = isLast ? 'Get Started' : 'Continue';
  const copy = STEPS[step] ?? STEPS[0];

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={statusBarStyle} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          {!isFirst && !isLast ? (
            <BackButton onPress={prev} disabled={isSubmitting} />
          ) : (
            <View style={styles.backSpacer} />
          )}
          {canSkip ? (
            <Pressable
              onPress={next}
              disabled={isSubmitting}
              hitSlop={10}
              style={({ pressed }) => [
                styles.skipButton,
                { opacity: isSubmitting ? 0.35 : pressed ? 0.62 : 1 },
              ]}
            >
              <Typography style={[styles.skipText, { color: colors.primary }]}>Skip</Typography>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}
        </View>
        <Animated.View key={step} entering={FadeIn.duration(260)} style={styles.copyBlock}>
          <Typography style={[styles.title, { color: colors.text }]}>{copy.title}</Typography>
          <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
            {copy.subtitle}
          </Typography>
        </Animated.View>
        <ProfileStepProgress step={step} total={TOTAL_STEPS} />
      </View>

      <ProfileSetupPager />

      <KeyboardStickyView offset={{ closed: 0, opened: 0 }} style={styles.footer}>
        <Button
          label={buttonLabel}
          onPress={handleContinue}
          disabled={!valid}
          isLoading={isSubmitting}
        />
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  backSpacer: {
    width: 40,
    height: 40,
  },
  skipButton: {
    minWidth: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  skipText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  copyBlock: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
