import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { fonts, palette } from '@/shared/theme';

import { Typography } from './Typography';

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function SocialButton({ icon, label, onPress, disabled }: SocialButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: palette.neutral['2'] }}
    >
      <View style={styles.icon}>{icon}</View>
      <Typography style={styles.label}>{label}</Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.neutral['1'],
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  pressed: { opacity: 0.85 },
  icon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: palette.neutral['9'],
  },
});
