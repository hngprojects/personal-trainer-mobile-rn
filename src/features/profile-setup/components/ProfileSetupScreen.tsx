import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

import { useProfileSetupSubmit } from '../hooks/useProfileSetupSubmit';
import { TOTAL_STEPS, useProfileSetupStore } from '../store/profile-setup.store';
import { BackButton } from './BackButton';
import { ProfileSetupPager } from './ProfileSetupPager';
import { ProfileStepProgress } from './ProfileStepProgress';

const STEP_TITLES = [
  'Complete your profile',
  'Select your gender',
  'What are your fitness goals?',
  'Choose your fitness level',
  'Your Personalized Fitness Journey Starts Here.',
];

const MIN_GOALS = 1;

export function ProfileSetupScreen() {
  const step = useProfileSetupStore((s) => s.step);
  const name = useProfileSetupStore((s) => s.draft.name);
  const email = useProfileSetupStore((s) => s.draft.email);
  const gender = useProfileSetupStore((s) => s.draft.gender);
  const goalsCount = useProfileSetupStore((s) => s.draft.goals.length);
  const fitnessLevel = useProfileSetupStore((s) => s.draft.fitnessLevel);
  const prev = useProfileSetupStore((s) => s.prev);
  const next = useProfileSetupStore((s) => s.next);
  const { submit, isSubmitting } = useProfileSetupSubmit();

  const valid = useMemo(() => {
    switch (step) {
      case 0:
        return name.trim().length > 1 && email.length > 0;
      case 1:
        return gender !== null;
      case 2:
        return goalsCount >= MIN_GOALS;
      case 3:
        return fitnessLevel !== null;
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, name, email, gender, goalsCount, fitnessLevel]);

  const isLast = step === TOTAL_STEPS - 1;
  const handleContinue = isLast ? submit : next;
  const buttonLabel = isLast ? 'Get Started' : 'Continue';

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <BackButton onPress={prev} disabled={step === 0 || isSubmitting} />
          <Animated.View key={step} entering={FadeIn.duration(260)} style={styles.titleWrap}>
            <Typography style={styles.title}>{STEP_TITLES[step]}</Typography>
          </Animated.View>
        </View>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleWrap: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: palette.neutral['9'],
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
