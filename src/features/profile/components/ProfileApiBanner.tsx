import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

interface ProfileApiBannerProps {
  message?: string;
  onRetry: () => void;
}

export function ProfileApiBanner({
  message = "We couldn't refresh your profile. Showing cached information.",
  onRetry,
}: ProfileApiBannerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.banner, { backgroundColor: colors.primarySubtle, borderColor: colors.border }]}
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.primary} />
      <Typography style={[styles.message, { color: colors.text }]}>{message}</Typography>
      <Pressable onPress={onRetry} hitSlop={8}>
        <Typography style={[styles.retry, { color: colors.primary }]}>Retry</Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  message: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 17,
  },
  retry: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
});
