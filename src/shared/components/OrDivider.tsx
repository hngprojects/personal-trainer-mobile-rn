import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

interface OrDividerProps {
  label?: string;
}

export function OrDivider({ label = 'OR' }: OrDividerProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <Typography style={[styles.label, { color: colors.textSecondary }]}>{label}</Typography>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 1,
  },
});
