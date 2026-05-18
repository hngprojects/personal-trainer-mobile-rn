import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { palette, useTheme } from '@/shared/theme';

interface ProfileStepProgressProps {
  step: number;
  total: number;
}

export function ProfileStepProgress({ step, total }: ProfileStepProgressProps) {
  const { colors } = useTheme();
  const progress = useSharedValue((step + 1) / total);

  React.useEffect(() => {
    progress.value = withTiming((step + 1) / total, { duration: 320 });
  }, [step, total, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.highlightBlue['5'],
  },
});
