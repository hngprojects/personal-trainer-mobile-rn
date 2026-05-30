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

import { useTheme } from '@/shared/theme';

import { Typography } from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BRAND_NAVY_PRESSED = '#06203F';

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

  const { background, text } = resolveColors(variant, isDisabled, colors);

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
          borderColor: isDisabled ? colors.border : colors.primary,
        },
        variant === 'secondary' && {
          borderWidth: 1,
          borderColor: colors.border,
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
          <Typography
            variant="body1"
            color={text}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={styles.label}
          >
            {label}
          </Typography>
        )}
      </View>
    </Pressable>
  );
}

function resolveColors(
  variant: ButtonVariant,
  isDisabled: boolean,
  colors: ReturnType<typeof useTheme>['colors'],
) {
  const disabledText = colors.textSecondary;
  if (variant === 'primary') {
    return {
      background: isDisabled ? colors.surfaceMuted : colors.primary,
      text: isDisabled ? disabledText : '#FFFFFF',
    };
  }
  if (variant === 'secondary') {
    return {
      background: colors.surface,
      text: isDisabled ? disabledText : colors.primary,
    };
  }
  // outline + ghost
  return {
    background: 'transparent',
    text: isDisabled ? disabledText : colors.primary,
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
    maxWidth: '100%',
    minWidth: 0,
  },
  label: {
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'center',
  },
});
