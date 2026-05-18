import React, { useEffect, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { useProfileSetupStore } from '../store/profile-setup.store';
import { AboutStep } from './steps/AboutStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { FitnessLevelStep } from './steps/FitnessLevelStep';
import { GoalsStep } from './steps/GoalsStep';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ProfileSetupPager() {
  const step = useProfileSetupStore((s) => s.step);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: step * SCREEN_WIDTH, animated: true });
  }, [step]);

  const sharedProps = { scrollX, slideWidth: SCREEN_WIDTH };

  return (
    <Animated.ScrollView
      ref={scrollRef as unknown as React.RefObject<Animated.ScrollView>}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.fill}
    >
      <BasicInfoStep index={0} {...sharedProps} />
      <GoalsStep index={1} {...sharedProps} />
      <FitnessLevelStep index={2} {...sharedProps} />
      <AboutStep index={3} {...sharedProps} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
