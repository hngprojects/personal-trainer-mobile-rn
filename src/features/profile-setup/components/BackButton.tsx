import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { palette } from '@/shared/theme';

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function BackButton({ onPress, disabled }: BackButtonProps) {
  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, { opacity: disabled ? 0.35 : pressed ? 0.6 : 1 }]}
    >
      <Ionicons name="chevron-back" size={22} color={palette.neutral['9']} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.neutral['0.5'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
});
