import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, palette } from '@/shared/theme';

import { Typography } from './Typography';

interface OrDividerProps {
  label?: string;
}

export function OrDivider({ label = 'OR' }: OrDividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Typography style={styles.label}>{label}</Typography>
      <View style={styles.line} />
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
    backgroundColor: palette.neutral['2'],
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: palette.neutral['5'],
    letterSpacing: 1,
  },
});
