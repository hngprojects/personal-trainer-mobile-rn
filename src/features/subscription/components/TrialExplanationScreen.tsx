import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, TimelineIndicator, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

interface TrialExplanationScreenProps {
  onContinue: () => void;
  onSkip: () => void;
  step: number;
  totalSteps: number;
}

export function TrialExplanationScreen({ onContinue, onSkip, step, totalSteps }: TrialExplanationScreenProps) {
  const { colors, spacing } = useTheme();

  const timelineSteps = [
    {
      title: 'Today (Start Trial)',
      description: 'Get full access to all workouts, nutrition plans, and 1-on-1 messaging.',
      isCompleted: true,
      isActive: true,
      icon: 'checkmark' as const,
    },
    {
      title: 'Day 5',
      description: 'We will send you a reminder email.',
      isCompleted: false,
      isActive: false,
      icon: 'mail' as const,
    },
    {
      title: 'Day 7',
      description: 'Your 7-day trial ends, and your subscription begins.',
      isCompleted: false,
      isActive: false,
      icon: 'card' as const,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={styles.stepContainer}>
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            {step} of {totalSteps}
          </Typography>
          <View style={styles.divider} />
          <Typography
            variant="body2"
            color={colors.primary}
            style={{ fontWeight: '600' }}
            onPress={onSkip}
          >
            Skip &gt;
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}>
        <Typography variant="h2" style={styles.title}>
          How your 7-day trial works
        </Typography>
        <Typography variant="body2" color={palette.neutral['6']} style={styles.subtitle}>
          Cancel anytime within 7 days and you won't be charged.
        </Typography>

        <View style={styles.timelineWrapper}>
          <TimelineIndicator steps={timelineSteps} />
        </View>

        <View style={[styles.alertBox, { backgroundColor: palette.success['0.5'] }]}>
          <Typography variant="body2" color={palette.success['6']} style={{ fontWeight: '500' }}>
            Next billing date: <Typography variant="body2" style={{ fontWeight: '700' }}>August 31</Typography>
          </Typography>
          <Typography variant="label" color={palette.success['5']} style={{ marginTop: 4 }}>
            Cancel anytime before this date.
          </Typography>
        </View>
      </ScrollView>

      <View style={[styles.footer, { padding: spacing.md }]}>
        <Button label="Continue" onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 56,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: palette.neutral['3'],
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  timelineWrapper: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  alertBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.neutral['2'],
  },
});
