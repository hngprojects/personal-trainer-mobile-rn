import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { OnboardingCalloutData } from '../data/slides';

interface OnboardingCalloutProps {
  data: OnboardingCalloutData;
  scrollX: SharedValue<number>;
  index: number;
  slideWidth: number;
}

export function OnboardingCallout({ data, scrollX, index, slideWidth }: OnboardingCalloutProps) {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }, { scale }] };
  });

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: colors.background },
        data.position as ViewStyle,
        animatedStyle,
      ]}
    >
      {data.variant === 'icon' ? (
        <View
          style={[styles.iconBox, { backgroundColor: data.iconBg ?? palette.highlightBlue['7'] }]}
        >
          <Typography style={styles.iconEmoji}>{data.iconEmoji ?? '📅'}</Typography>
        </View>
      ) : (
        <View style={[styles.avatar, { backgroundColor: data.avatarBg ?? palette.neutral['5'] }]}>
          <Typography style={styles.initials}>{data.initials ?? 'P'}</Typography>
        </View>
      )}

      <View style={styles.textBlock}>
        <Typography style={[styles.title, { color: colors.text }]}>{data.title}</Typography>
        {data.rating !== undefined ? (
          <View style={styles.ratingRow}>
            <Typography style={styles.star}>★</Typography>
            <Typography style={[styles.ratingValue, { color: colors.text }]}>
              {data.rating.toFixed(1)}
            </Typography>
          </View>
        ) : data.subtitle ? (
          <Typography style={[styles.subtitle, { color: colors.textSecondary }]}>
            {data.subtitle}
          </Typography>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 8,
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 14,
    lineHeight: 18,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  textBlock: {
    gap: 1,
  },
  title: {
    fontSize: 12,
    fontFamily: fonts.bold,
    lineHeight: 15,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: fonts.regular,
    lineHeight: 13,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  star: {
    fontSize: 11,
    color: palette.gold['4'],
    lineHeight: 14,
  },
  ratingValue: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    lineHeight: 14,
  },
});
