import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SharedValue } from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useProfileSetupStore } from '../../store/profile-setup.store';
import type { FitnessLevel } from '../../types/profile-setup.types';
import { StepShell } from '../StepShell';

interface FitnessLevelStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

const LEVELS: {
  id: FitnessLevel;
  label: string;
  description: string;
}[] = [
  {
    id: 'easy',
    label: 'Easy to start',
    description:
      "Great choice! We'll guide you step-by-step, so even if you're just starting out, you'll build confidence and get moving at a comfortable pace.",
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description:
      "Awesome! You have a solid foundation. We'll challenge you with more advanced moves and help you level up steadily.",
  },
  {
    id: 'challenging',
    label: 'A bit challenging',
    description:
      "You're ready to push your limits! We'll provide expert-level routines to help you surpass your goals.",
  },
];

export function FitnessLevelStep({ index, scrollX, slideWidth }: FitnessLevelStepProps) {
  const { colors } = useTheme();
  const level = useProfileSetupStore((s) => s.draft.fitnessLevel);
  const setLevel = useProfileSetupStore((s) => s.setFitnessLevel);

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <View style={styles.list}>
        {LEVELS.map((l, i) => {
          const selected = level === l.id;
          return (
            <Animated.View key={l.id} entering={FadeInDown.delay(80 + i * 70).duration(360)}>
              <Pressable
                onPress={() => setLevel(l.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.row,
                  {
                    borderColor: selected ? palette.highlightBlue['5'] : colors.divider,
                    backgroundColor: colors.background,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.rowHeader}>
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: selected ? palette.highlightBlue['5'] : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Typography
                    style={[
                      styles.label,
                      { color: selected ? palette.highlightBlue['7'] : colors.text },
                    ]}
                  >
                    {l.label}
                  </Typography>
                </View>

                {selected ? (
                  <Animated.View entering={FadeInUp.duration(220)} style={styles.descriptionWrap}>
                    <Typography style={styles.description}>{l.description}</Typography>
                  </Animated.View>
                ) : null}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.highlightBlue['5'],
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  descriptionWrap: {
    backgroundColor: palette.highlightBlue['0.5'],
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  description: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: palette.highlightBlue['7'],
    lineHeight: 18,
  },
});
