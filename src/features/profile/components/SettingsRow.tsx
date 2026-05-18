import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  hideChevron?: boolean;
  labelColor?: string;
}

export function SettingsRow({
  icon,
  label,
  subtitle,
  onPress,
  rightSlot,
  hideChevron = false,
  labelColor,
}: SettingsRowProps) {
  const { colors } = useTheme();

  const right =
    rightSlot ??
    (!hideChevron && onPress ? (
      <Ionicons name="chevron-forward" size={18} color={colors.iconMuted} />
    ) : null);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: colors.surfaceMuted } : undefined}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.textCol}>
        <Typography style={[styles.label, { color: labelColor ?? colors.text }]} numberOfLines={1}>
          {label}
        </Typography>
        {subtitle ? (
          <Typography style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Typography>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  right: {
    marginLeft: 'auto',
  },
});
