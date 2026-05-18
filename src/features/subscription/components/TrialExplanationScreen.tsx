import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, TimelineIndicator, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

interface TrialExplanationScreenProps {
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  step: number;
  totalSteps: number;
}

export function TrialExplanationScreen({
  onContinue,
  onSkip,
  onBack,
  step,
  totalSteps,
}: TrialExplanationScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            Back
          </Typography>
        </Pressable>
        <View style={styles.stepContainer}>
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            {step} of {totalSteps}
          </Typography>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
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

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.md, paddingBottom: 40 + insets.bottom },
        ]}
      >
        <Typography variant="h2" style={styles.title}>
          How your 7-day trial works
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
          Cancel anytime within 7 days and you won&apos;t be charged.
        </Typography>

        <View style={styles.timelineWrapper}>
          <TimelineIndicator steps={timelineSteps} />
        </View>

        <View style={[styles.alertBox, { backgroundColor: colors.surfaceMuted }]}>
          <Typography variant="body2" color={colors.success} style={{ fontWeight: '500' }}>
            Next billing date:{' '}
            <Typography variant="body2" color={colors.success} style={{ fontWeight: '700' }}>
              August 31
            </Typography>
          </Typography>
          <Typography variant="label" color={colors.success} style={{ marginTop: 4 }}>
            Cancel anytime before this date.
          </Typography>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.md + insets.bottom,
          },
        ]}
      >
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 12,
  },
  content: {
    paddingTop: 16,
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
  },
});
