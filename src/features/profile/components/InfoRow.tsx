import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

interface InfoRowProps {
  label: string;
  value: string;
  onPress?: () => void;
}

export function InfoRow({ label, value, onPress }: InfoRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: colors.surfaceMuted } : undefined}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <Typography style={[styles.label, { color: colors.text }]}>{label}</Typography>
      <View style={styles.spacer} />
      <Typography style={[styles.value, { color: colors.textMuted }]} numberOfLines={1}>
        {value}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  spacer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  value: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'right',
    maxWidth: '60%',
  },
});
