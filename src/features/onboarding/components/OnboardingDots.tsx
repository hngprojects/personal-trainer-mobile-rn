import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

interface OnboardingDotsProps {
  total: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

export function OnboardingDots({ total, scrollX, slideWidth }: OnboardingDotsProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.xs }]}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} index={i} scrollX={scrollX} slideWidth={slideWidth} color={colors.primary} />
      ))}
    </View>
  );
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  color: string;
}

function Dot({ index, scrollX, slideWidth, color }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];
    const width = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.25, 1, 0.25], Extrapolation.CLAMP);
    return { width, opacity };
  });

  return <Animated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: { height: 8, borderRadius: 4 },
});
