import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

interface SuccessStateProps {
  title: string;
  message: string;
}

export function SuccessState({ title, message }: SuccessStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={36} color="#FFFFFF" />
      </View>
      <Typography style={styles.title}>{title}</Typography>
      <Typography style={styles.message}>{message}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: palette.success['5'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: palette.neutral['9'],
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    textAlign: 'center',
  },
});
