import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  edges?: Edge[];
  style?: ViewStyle;
}

export function GradientBackground({
  children,
  colors = ['#F4F7FB', '#FFFFFF'],
  edges = ['top', 'bottom'],
  style,
}: GradientBackgroundProps) {
  return (
    <LinearGradient colors={colors} style={[styles.fill, style]}>
      <SafeAreaView style={styles.fill} edges={edges}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
