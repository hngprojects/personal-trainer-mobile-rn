import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SharedValue } from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useProfileSetupStore } from '../../store/profile-setup.store';
import type { Gender } from '../../types/profile-setup.types';
import { StepShell } from '../StepShell';

interface GenderStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

const OPTIONS: { id: Gender; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'male', label: 'Male', icon: 'male' },
  { id: 'female', label: 'Female', icon: 'female' },
];

export function GenderStep({ index, scrollX, slideWidth }: GenderStepProps) {
  const { colors } = useTheme();
  const gender = useProfileSetupStore((s) => s.draft.gender);
  const setGender = useProfileSetupStore((s) => s.setGender);

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <View style={styles.list}>
        {OPTIONS.map((opt, i) => {
          const isSelected = gender === opt.id;
          return (
            <Animated.View key={opt.id} entering={FadeInDown.delay(120 + i * 100).duration(380)}>
              <Pressable
                onPress={() => setGender(opt.id)}
                style={({ pressed }) => [
                  styles.circle,
                  { backgroundColor: isSelected ? colors.primary : palette.neutral['1'] },
                  pressed && { opacity: 0.88 },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={34}
                  color={isSelected ? '#FFFFFF' : palette.neutral['9']}
                />
                <Typography
                  style={[styles.label, { color: isSelected ? '#FFFFFF' : palette.neutral['9'] }]}
                >
                  {opt.label}
                </Typography>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </StepShell>
  );
}

const CIRCLE_SIZE = 122;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
});
