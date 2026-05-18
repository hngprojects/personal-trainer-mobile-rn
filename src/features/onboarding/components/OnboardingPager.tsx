import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingSlide } from './OnboardingSlide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingPagerProps {
  slides: OnboardingSlideData[];
  onLogin: () => void;
  onRegister: () => void;
}

export function OnboardingPager({ slides, onLogin, onRegister }: OnboardingPagerProps) {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.fill}
    >
      {slides.map((slide, i) => (
        <OnboardingSlide
          key={slide.id}
          slide={slide}
          index={i}
          scrollX={scrollX}
          totalSlides={slides.length}
          slideWidth={SCREEN_WIDTH}
          onLogin={onLogin}
          onRegister={onRegister}
        />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
