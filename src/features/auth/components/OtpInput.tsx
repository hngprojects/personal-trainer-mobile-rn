import React, { useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';

import { fonts, palette } from '@/shared/theme';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const refs = useRef<(RNTextInput | null)[]>([]);
  const hasError = !!error;

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, text: string) => {
    const char = text.length > 0 ? text[text.length - 1] : '';
    if (char && !/^\d$/.test(char)) return;

    const next = digits.slice();
    next[index] = char;
    onChange(next.join(''));

    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((digit, i) => (
        <RNTextInput
          key={i}
          ref={(ref) => {
            refs.current[i] = ref;
          }}
          value={digit}
          onChangeText={(t) => handleChange(i, t)}
          onKeyPress={(e) => handleKeyPress(i, e)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          style={[
            styles.box,
            { borderColor: hasError ? palette.highlightRed['5'] : palette.neutral['2'] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: palette.neutral['9'],
    backgroundColor: '#FFFFFF',
  },
});
