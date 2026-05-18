import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

interface WelcomeAnimationProps {
  isNewUser: boolean;
}

const ICON_SIZE = 96;
const HALO_SIZE = 160;

export function WelcomeAnimation({ isNewUser }: WelcomeAnimationProps) {
  const { colors } = useTheme();
  const haloScale = useSharedValue(0.6);
  const haloOpacity = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    haloOpacity.value = withTiming(0.45, { duration: 450 });
    haloScale.value = withSequence(
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.cubic) }),
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );

    circleScale.value = withDelay(
      200,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.6)) }),
    );

    checkScale.value = withDelay(
      520,
      withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }),
    );

    textOpacity.value = withDelay(720, withTiming(1, { duration: 400 }));
    textTranslateY.value = withDelay(
      720,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
    transform: [{ scale: haloScale.value }],
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const title = isNewUser ? 'Success' : 'Welcome back';
  const subtitle = isNewUser ? 'Your account has been created successfully' : "You're signed in";

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.halo, haloStyle]} />
        <Animated.View style={[styles.circle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View style={textStyle}>
        <Typography style={[styles.title, { color: colors.text }]}>{title}</Typography>
        <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    backgroundColor: palette.success['2'],
  },
  circle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: palette.success['5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
});
