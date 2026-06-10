import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';

import { fonts, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TextInput = forwardRef<RNTextInput, AppTextInputProps>(
  ({ label, error, required, secureTextEntry, style, ...props }, ref) => {
    const { colors } = useTheme();
    const isPassword = !!secureTextEntry;
    const [hidden, setHidden] = useState(isPassword);
    const hasError = !!error;

    // Compose the input's accessible name from explicit label + required marker.
    // Callers can still override by passing accessibilityLabel directly.
    const requiredSuffix = required ? ', required' : '';
    const a11yLabel = props.accessibilityLabel ?? (label ? `${label}${requiredSuffix}` : undefined);

    return (
      <View style={styles.container}>
        {label && (
          <Typography style={[styles.label, { color: colors.text }]}>
            {label}
            {required ? (
              <Typography style={[styles.required, { color: colors.error }]}> *</Typography>
            ) : null}
          </Typography>
        )}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: hasError ? colors.error : colors.border,
              backgroundColor: colors.inputBackground,
            },
          ]}
        >
          <RNTextInput
            ref={ref}
            secureTextEntry={isPassword ? hidden : false}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={a11yLabel}
            accessibilityState={{ disabled: !!props.editable === false }}
            style={[styles.input, { color: colors.text }, style]}
            {...props}
          />
          {isPassword && (
            <Pressable
              onPress={() => setHidden((h) => !h)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
              style={styles.iconButton}
            >
              <Ionicons
                name={hidden ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
        {error && (
          <Typography
            accessibilityLiveRegion="polite"
            style={[styles.error, { color: colors.error }]}
          >
            {error}
          </Typography>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  required: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  iconButton: {
    paddingLeft: 8,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: 'right',
  },
});
