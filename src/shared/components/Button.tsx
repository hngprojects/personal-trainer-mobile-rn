import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { palette, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BRAND_NAVY_PRESSED = '#06203F';
const DISABLED_BG = '#F5F5F5';
const DISABLED_TEXT = '#00192F3D';

export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = !!(disabled || isLoading);

  const { background, text } = resolveColors(variant, isDisabled, colors.primary);

  return (
    <Pressable
      // Key tied to disabled state forces a clean remount when validity flips,
      // bypassing the RN reconciler bailout that was caching the native bg.
      key={isDisabled ? 'disabled' : 'active'}
      style={[
        styles.base,
        { backgroundColor: background },
        variant === 'outline' && {
          borderWidth: 1.5,
          borderColor: isDisabled ? palette.neutral['2'] : colors.primary,
        },
        variant === 'secondary' && {
          borderWidth: 1,
          borderColor: palette.neutral['2'],
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
      ]}
      disabled={isDisabled}
      android_ripple={isDisabled ? undefined : { color: BRAND_NAVY_PRESSED }}
      {...props}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={text} size="small" />
        ) : (
          <Typography variant="body1" color={text} style={styles.label}>
            {label}
          </Typography>
        )}
      </View>
    </Pressable>
  );
}

function resolveColors(variant: ButtonVariant, isDisabled: boolean, primary: string) {
  if (variant === 'primary') {
    return {
      background: isDisabled ? DISABLED_BG : primary,
      text: isDisabled ? DISABLED_TEXT : '#FFFFFF',
    };
  }
  if (variant === 'secondary') {
    return {
      background: palette.neutral['0.5'],
      text: isDisabled ? DISABLED_TEXT : primary,
    };
  }
  // outline + ghost
  return {
    background: 'transparent',
    text: isDisabled ? DISABLED_TEXT : primary,
  };
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
});
