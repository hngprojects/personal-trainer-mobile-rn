import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  ToastItem as ToastItemType,
  ToastVariant,
  useToastStore,
} from '@/shared/store/toast.store';
import { fonts, palette } from '@/shared/theme';

import { Typography } from './Typography';

const VARIANT_COLORS: Record<ToastVariant, { bg: string; fg: string }> = {
  success: { bg: palette.success['5'], fg: '#FFFFFF' },
  error: { bg: palette.highlightRed['5'], fg: '#FFFFFF' },
  info: { bg: palette.neutral['8'], fg: '#FFFFFF' },
};

const TOP_OFFSET = Platform.select({
  ios: 50,
  android: (StatusBar.currentHeight ?? 24) + 8,
  default: 16,
});

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: TOP_OFFSET }]}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}

function ToastItem({ toast }: { toast: ToastItemType }) {
  const hide = useToastStore((s) => s.hide);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const variantColors = VARIANT_COLORS[toast.variant];

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
    translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-20, { duration: 200 }, (finished) => {
        if (finished) runOnJS(hide)(toast.id);
      });
    }, toast.duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[styles.toast, animatedStyle, { backgroundColor: variantColors.bg }]}
      pointerEvents="auto"
    >
      <Typography style={[styles.message, { color: variantColors.fg }]} numberOfLines={3}>
        {toast.message}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: '50%',
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
