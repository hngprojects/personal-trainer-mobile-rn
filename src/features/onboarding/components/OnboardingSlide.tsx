import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingCallout } from './OnboardingCallout';
import { OnboardingDots } from './OnboardingDots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PHONE_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 380);
const IMAGE_HEIGHT = PHONE_WIDTH / 0.494;

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
  const { spacing, colors } = useTheme();
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [mounted]);

  const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];

  const phoneStyle = useAnimatedStyle(() => {
    const opacityFromScroll = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(scrollX.value, inputRange, [0.92, 1, 0.92], Extrapolation.CLAMP);
    const translateX = interpolate(scrollX.value, inputRange, [-40, 0, 40], Extrapolation.CLAMP);
    return {
      opacity: opacityFromScroll * mounted.value,
      transform: [{ scale }, { translateX }],
    };
  });

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

  return (
    <View style={[styles.container, { width: slideWidth, paddingHorizontal: spacing.lg }]}>
      <View style={styles.phoneAnchor}>
        <View style={styles.phoneClip}>
          <Animated.Image
            source={slide.image}
            style={[styles.phoneImage, phoneStyle]}
            resizeMode="contain"
          />
        </View>
        <OnboardingCallout
          data={slide.callout}
          scrollX={scrollX}
          index={index}
          slideWidth={slideWidth}
        />
      </View>

      <View
        style={[
          styles.card,
          { paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
        ]}
      >
        <View style={{ gap: spacing.sm }}>
          <Animated.View style={titleStyle}>
            <Typography variant="h2" align="center" color={colors.text}>
              {slide.title}
            </Typography>
          </Animated.View>
          <Animated.View style={subtitleStyle}>
            <Typography variant="body1" color={colors.textSecondary} align="center">
              {slide.subtitle}
            </Typography>
          </Animated.View>
        </View>

        <View style={styles.dotsRow}>
          <OnboardingDots total={totalSlides} scrollX={scrollX} slideWidth={slideWidth} />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Button label="Get Started" onPress={onRegister} />
          <Button label="Log In" variant="secondary" onPress={onLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  phoneAnchor: {
    flex: 1,
    width: PHONE_WIDTH,
    position: 'relative',
    zIndex: 0,
  },
  phoneClip: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  phoneImage: {
    width: PHONE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  card: {
    width: '100%',
    zIndex: 1,
    elevation: 1,
  },
  dotsRow: {
    alignItems: 'center',
  },
});
