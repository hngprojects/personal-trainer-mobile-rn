import React, { useEffect } from 'react';
import { RefreshControl, ScrollViewProps, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

interface LogoRefreshScrollViewProps extends Omit<ScrollViewProps, 'onScroll' | 'refreshControl'> {
  refreshing: boolean;
  onRefresh: () => void;
}

export function LogoRefreshScrollView({
  refreshing,
  onRefresh,
  children,
  ...scrollViewProps
}: LogoRefreshScrollViewProps) {
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const refreshVisibility = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    logoRotation.value = withRepeat(
      withTiming(360, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [logoRotation]);

  useEffect(() => {
    refreshVisibility.value = withTiming(refreshing ? 1 : 0, { duration: 160 });
  }, [refreshing, refreshVisibility]);

  const refreshLogoStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshVisibility.value);

    return {
      opacity: visibility,
      transform: [
        {
          translateY: interpolate(scrollY.value, [-110, 0], [74, 40], Extrapolation.CLAMP),
        },
        { scale: interpolate(visibility, [0, 1], [0.86, 1], Extrapolation.CLAMP) },
        { rotate: `${logoRotation.value}deg` },
      ],
    };
  });

  const contentRefreshStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshVisibility.value);

    return {
      opacity: interpolate(visibility, [0, 1], [1, 0.46], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(visibility, [0, 1], [1, 0.985], Extrapolation.CLAMP) }],
    };
  });

  const refreshVeilStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshVisibility.value);

    return {
      opacity: interpolate(visibility, [0, 1], [0, 0.62], Extrapolation.CLAMP),
    };
  });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.refreshVeil, { backgroundColor: colors.background }, refreshVeilStyle]}
      />
      <Animated.View pointerEvents="none" style={[styles.refreshLogoLayer, refreshLogoStyle]}>
        <Animated.Image source={LOGO} style={styles.refreshLogo} />
      </Animated.View>

      <Animated.ScrollView
        {...scrollViewProps}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
            progressBackgroundColor="transparent"
            progressViewOffset={-1000}
          />
        }
      >
        <Animated.View style={contentRefreshStyle}>{children}</Animated.View>
      </Animated.ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  refreshVeil: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 8,
  },
  refreshLogoLayer: {
    position: 'absolute',
    top: 28,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  refreshLogo: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
});
