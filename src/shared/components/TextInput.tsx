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
            style={[styles.input, { color: colors.text }, style]}
            {...props}
          />
          {isPassword && (
            <Pressable
              onPress={() => setHidden((h) => !h)}
              hitSlop={8}
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
          <Typography style={[styles.error, { color: colors.error }]}>{error}</Typography>
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
