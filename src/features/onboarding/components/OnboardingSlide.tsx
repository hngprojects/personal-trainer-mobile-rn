import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { OnboardingSlideData } from '../data/slides';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH, paddingHorizontal: spacing.xl }]}>
      <View style={[styles.illustrationContainer, { backgroundColor: slide.accentColor + '20' }]}>
        <Typography style={styles.emoji}>{slide.emoji}</Typography>
      </View>

      <Typography variant="h2" align="center" style={{ marginTop: spacing.xl }}>
        {slide.title}
      </Typography>

      <Typography
        variant="body1"
        color={colors.textSecondary}
        align="center"
        style={{ marginTop: spacing.sm }}
      >
        {slide.subtitle}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  illustrationContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 80,
    lineHeight: 96,
  },
});
