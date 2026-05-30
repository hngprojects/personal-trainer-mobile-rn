import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingDots } from './OnboardingDots';

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
  index: number;
  scrollX: SharedValue<number>;
  totalSlides: number;
  slideWidth: number;
  onLogin: () => void;
  onRegister: () => void;
}

export function OnboardingSlide({
  slide,
  index,
  scrollX,
  totalSlides,
  slideWidth,
  onLogin,
  onRegister,
}: OnboardingSlideProps) {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [mounted]);

  const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];

  const titleStyle = useAnimatedStyle(() => {
    const opacityFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateYFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [40, 0, 40],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacityFromScroll * mounted.value,
      transform: [{ translateY: translateYFromScroll + (1 - mounted.value) * 30 }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const opacityFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateYFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [60, 0, 60],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacityFromScroll * mounted.value,
      transform: [{ translateY: translateYFromScroll + (1 - mounted.value) * 50 }],
    };
  });

  const panelStyle = useAnimatedStyle(() => {
    const opacityFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateYFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [36, 0, 36],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(scrollX.value, inputRange, [0.96, 1, 0.96], Extrapolation.CLAMP);
    return {
      opacity: opacityFromScroll * mounted.value,
      transform: [{ translateY: translateYFromScroll + (1 - mounted.value) * 28 }, { scale }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: slideWidth,
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <Animated.View style={[styles.card, { padding: spacing.lg, gap: spacing.md }, panelStyle]}>
        <View style={{ gap: spacing.sm }}>
          <Animated.View style={titleStyle}>
            <Typography variant="h2" align="center" color="#FFFFFF" style={styles.title}>
              {slide.title}
            </Typography>
          </Animated.View>
          <Animated.View style={subtitleStyle}>
            <Typography
              variant="body1"
              color="rgba(255,255,255,0.78)"
              align="center"
              style={styles.subtitle}
            >
              {slide.subtitle}
            </Typography>
          </Animated.View>
        </View>

        <View style={styles.dotsRow}>
          <OnboardingDots total={totalSlides} scrollX={scrollX} slideWidth={slideWidth} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Button
            label="Get Started"
            onPress={onRegister}
            style={[
              styles.primaryButton,
              {
                backgroundColor: '#0F4690',
                borderColor: 'rgba(255,255,255,0.28)',
              },
            ]}
          />
          <Button
            label="Log In"
            onPress={onLogin}
            style={[
              styles.secondaryButton,
              {
                backgroundColor: 'rgba(255,255,255,0.16)',
                borderColor: 'rgba(255,255,255,0.30)',
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    zIndex: 1,
    elevation: 5,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(4,14,29,0.56)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  title: {
    lineHeight: 34,
  },
  subtitle: {
    lineHeight: 23,
  },
  dotsRow: {
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
  },
});
