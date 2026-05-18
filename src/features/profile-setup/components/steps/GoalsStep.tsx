import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SharedValue } from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useProfileSetupStore } from '../../store/profile-setup.store';
import type { FitnessGoal } from '../../types/profile-setup.types';
import { StepShell } from '../StepShell';

interface GoalsStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

const GOALS: { id: FitnessGoal; label: string }[] = [
  { id: 'lose_weight', label: 'Loose Weight' },
  { id: 'build_muscle', label: 'Build Muscle' },
  { id: 'flexibility', label: 'Improve Flexibility & Mobility' },
  { id: 'endurance', label: 'Boost Energy & Endurance' },
  { id: 'habits', label: 'Build Healthy Long-Term Habits' },
  { id: 'strength', label: 'Build Strength' },
];

export function GoalsStep({ index, scrollX, slideWidth }: GoalsStepProps) {
  const { colors } = useTheme();
  const goals = useProfileSetupStore((s) => s.draft.goals);
  const toggleGoal = useProfileSetupStore((s) => s.toggleGoal);

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <View style={styles.list}>
        {GOALS.map((g, i) => {
          const isSelected = goals.includes(g.id);
          return (
            <Animated.View key={g.id} entering={FadeInDown.delay(80 + i * 60).duration(360)}>
              <Pressable
                onPress={() => toggleGoal(g.id)}
                style={({ pressed }) => [
                  styles.row,
                  {
                    borderColor: isSelected ? palette.highlightBlue['5'] : colors.divider,
                    backgroundColor: isSelected ? palette.highlightBlue['0.5'] : colors.background,
                  },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? palette.highlightBlue['5'] : colors.border,
                      backgroundColor: isSelected ? palette.highlightBlue['5'] : colors.background,
                    },
                  ]}
                >
                  {isSelected ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                </View>
                <Typography
                  style={[
                    styles.label,
                    { color: isSelected ? palette.highlightBlue['7'] : colors.text },
                  ]}
                >
                  {g.label}
                </Typography>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
