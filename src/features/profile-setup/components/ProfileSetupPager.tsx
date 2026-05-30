import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { useProfileSetupStore } from '../store/profile-setup.store';
import { AboutStep } from './steps/AboutStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { FitnessLevelStep } from './steps/FitnessLevelStep';
import { GoalsStep } from './steps/GoalsStep';

export function ProfileSetupPager() {
  const step = useProfileSetupStore((s) => s.step);
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: step * width, animated: true });
  }, [step, width]);

  const sharedProps = { scrollX, slideWidth: width };

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
