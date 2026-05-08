import React, { useRef } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingDots } from './OnboardingDots';
import { OnboardingSlide } from './OnboardingSlide';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingPagerProps {
  slides: OnboardingSlideData[];
  currentSlide: number;
  isLastSlide: boolean;
  onNext: () => void;
  onSkip: () => void;
  onSlideChange: (index: number) => void;
}

export function OnboardingPager({
  slides,
  currentSlide,
  isLastSlide,
  onNext,
  onSkip,
  onSlideChange,
}: OnboardingPagerProps) {
  const { spacing } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== currentSlide) onSlideChange(index);
  };

  const handleNext = () => {
    if (!isLastSlide) {
      scrollRef.current?.scrollTo({ x: (currentSlide + 1) * SCREEN_WIDTH, animated: true });
    }
    onNext();
  };

  const accentColor = slides[currentSlide]?.accentColor;

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <View style={[styles.skipRow, { paddingHorizontal: spacing.md, paddingTop: spacing.md }]}>
          <Button label="Skip" variant="ghost" onPress={onSkip} />
        </View>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.fill}
      >
        {slides.map((slide) => (
          <OnboardingSlide key={slide.id} slide={slide} />
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View
        style={[
          styles.footer,
          { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.lg },
        ]}
      >
        <OnboardingDots total={slides.length} current={currentSlide} accentColor={accentColor} />
        <Button label={isLastSlide ? 'Get Started' : 'Next'} onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fill: { flex: 1 },
  skipRow: { alignItems: 'flex-end' },
  footer: { alignItems: 'center' },
});
