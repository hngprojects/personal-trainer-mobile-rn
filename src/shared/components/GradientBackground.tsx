import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { palette, useTheme } from '@/shared/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  edges?: Edge[];
  style?: ViewStyle;
}

const LIGHT_GRADIENT = ['#F4F7FB', '#FFFFFF'] as const;
const DARK_GRADIENT = [palette.neutral['9'], palette.neutral['8']] as const;

export function GradientBackground({
  children,
  colors,
  edges = ['top', 'bottom'],
  style,
}: GradientBackgroundProps) {
  const { isDark } = useTheme();
  const resolved = colors ?? (isDark ? DARK_GRADIENT : LIGHT_GRADIENT);
  return (
    <LinearGradient colors={resolved} style={[styles.fill, style]}>
      <SafeAreaView style={styles.fill} edges={edges}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
