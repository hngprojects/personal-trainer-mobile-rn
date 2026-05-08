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

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors, spacing } = useTheme();
  const isDisabled = disabled || isLoading;

  const containerStyle = [
    styles.base,
    {
      paddingVertical: spacing.sm + 4,
      paddingHorizontal: spacing.lg,
      borderRadius: spacing.sm,
      opacity: isDisabled ? 0.6 : 1,
    },
    variant === 'primary' && { backgroundColor: colors.primary },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    style,
  ];

  const textColor = variant === 'primary' ? '#FFFFFF' : colors.primary;

  return (
    <Pressable
      style={containerStyle}
      disabled={isDisabled}
      android_ripple={{ color: colors.primaryPressed }}
      {...props}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Typography variant="body1" color={textColor} style={styles.label}>
            {label}
          </Typography>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
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
