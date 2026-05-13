import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SharedValue } from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

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
      'Perfect for beginners. Light sessions, simple movements, and plenty of rest between exercises.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description:
      'Already moving regularly? Step up with sessions that push your stamina and refine technique.',
  },
  {
    id: 'challenging',
    label: 'A bit challenging',
    description:
      'High intensity sessions for athletes. Expect demanding workouts, complex movements, and shorter rest.',
  },
];

export function FitnessLevelStep({ index, scrollX, slideWidth }: FitnessLevelStepProps) {
  const level = useProfileSetupStore((s) => s.draft.fitnessLevel);
  const setLevel = useProfileSetupStore((s) => s.setFitnessLevel);

  const selectedMeta = LEVELS.find((l) => l.id === level) ?? null;

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <View style={styles.list}>
        {LEVELS.map((l, i) => {
          const selected = level === l.id;
          return (
            <Animated.View key={l.id} entering={FadeInDown.delay(80 + i * 70).duration(360)}>
              <Pressable
                onPress={() => setLevel(l.id)}
                style={({ pressed }) => [
                  styles.row,
                  selected && styles.rowSelected,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
                <Typography
                  style={[
                    styles.label,
                    { color: selected ? palette.highlightBlue['7'] : palette.neutral['8'] },
                  ]}
                >
                  {l.label}
                </Typography>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {selectedMeta ? (
        <Animated.View
          key={selectedMeta.id}
          entering={FadeInUp.duration(280)}
          style={styles.infoBox}
        >
          <Typography style={styles.infoText}>{selectedMeta.description}</Typography>
        </Animated.View>
      ) : null}
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
    borderColor: palette.neutral['1'],
    backgroundColor: '#FFFFFF',
  },
  rowSelected: {
    borderColor: palette.highlightBlue['5'],
    backgroundColor: palette.highlightBlue['0.5'],
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: palette.neutral['3'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    borderColor: palette.highlightBlue['5'],
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
  infoBox: {
    marginTop: 20,
    backgroundColor: palette.highlightBlue['0.5'],
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.highlightBlue['1'],
  },
  infoText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.highlightBlue['7'],
    lineHeight: 20,
  },
});
