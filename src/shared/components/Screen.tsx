import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  padding?: boolean;
  backgroundColor?: string;
}

export function Screen({
  children,
  scrollable = false,
  edges = ['top', 'bottom'],
  padding = true,
  backgroundColor,
  style,
  ...props
}: ScreenProps) {
  const { colors, spacing } = useTheme();
  const bg = backgroundColor ?? colors.background;

  const inner = scrollable ? (
    <KeyboardAwareScrollView
      style={styles.fill}
      contentContainerStyle={[styles.scrollContent, padding && { padding: spacing.md }]}
      showsVerticalScrollIndicator={false}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </KeyboardAwareScrollView>
  ) : (
    <View style={[styles.fill, padding && { padding: spacing.md }, style]} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: bg }]} edges={edges}>
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
