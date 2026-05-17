import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, onBack, showBack = true }: ScreenHeaderProps) {
  const { colors } = useTheme();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable hitSlop={12} onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}
      {title ? (
        <Typography style={[styles.title, { color: colors.text }]}>{title}</Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
});
