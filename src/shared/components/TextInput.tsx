import React, { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { Typography } from './Typography';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<RNTextInput, AppTextInputProps>(
  ({ label, error, style, ...props }, ref) => {
    const { colors, spacing, typography } = useTheme();

    return (
      <View style={styles.container}>
        {label && (
          <Typography variant="label" style={styles.label}>
            {label}
          </Typography>
        )}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            typography.body1,
            {
              color: colors.text,
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm + 4,
              borderRadius: spacing.sm,
            },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {error && (
          <Typography variant="label" color={colors.error} style={styles.error}>
            {error}
          </Typography>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: { gap: 4 },
  label: { marginBottom: 2 },
  input: { borderWidth: 1.5 },
  error: { marginTop: 2 },
});
