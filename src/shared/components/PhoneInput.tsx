import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';

import { fonts, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

export type PhoneCountry = 'US' | 'UK';

interface CountryMeta {
  code: PhoneCountry;
  label: string;
  dialCode: string;
  flag: string;
  nationalLength: number;
}

const COUNTRIES: CountryMeta[] = [
  { code: 'US', label: 'United States', dialCode: '+1', flag: '🇺🇸', nationalLength: 10 },
  { code: 'UK', label: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', nationalLength: 10 },
];

function metaFor(country: PhoneCountry): CountryMeta {
  return COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
}

export function getPhoneNationalLength(country: PhoneCountry): number {
  return metaFor(country).nationalLength;
}

export function isPhoneComplete(digits: string, country: PhoneCountry): boolean {
  return digits.length === metaFor(country).nationalLength;
}

// Build an E.164-formatted number from digits + selected country. Returns null
// when the number isn't complete so callers can short-circuit submission.
export function toPhoneE164(digits: string, country: PhoneCountry): string | null {
  const meta = metaFor(country);
  if (digits.length !== meta.nationalLength) return null;
  return `${meta.dialCode}${digits}`;
}

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (digits: string) => void;
  country: PhoneCountry;
  onCountryChange: (country: PhoneCountry) => void;
  label?: string;
  error?: string;
}

export function PhoneInput({
  value,
  onChangeText,
  country,
  onCountryChange,
  label,
  error,
  style,
  ...props
}: PhoneInputProps) {
  const { colors } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);
  const meta = metaFor(country);
  const hasError = !!error;

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, meta.nationalLength);
    onChangeText(digits);
  };

  const handlePick = (next: PhoneCountry) => {
    setPickerVisible(false);
    if (next === country) return;
    const nextMax = metaFor(next).nationalLength;
    if (value.length > nextMax) onChangeText(value.slice(0, nextMax));
    onCountryChange(next);
  };

  return (
    <View style={styles.container}>
      {label ? (
        <Typography style={[styles.label, { color: colors.text }]}>{label}</Typography>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: hasError ? colors.error : colors.border,
            backgroundColor: colors.inputBackground,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Country code, currently ${meta.label}`}
          onPress={() => setPickerVisible(true)}
          style={[styles.countryPill, { borderRightColor: colors.border }]}
          hitSlop={6}
        >
          <Typography style={styles.flag}>{meta.flag}</Typography>
          <Typography style={[styles.dialCode, { color: colors.text }]}>{meta.dialCode}</Typography>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </Pressable>
        <RNTextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          maxLength={meta.nationalLength}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }, style]}
          {...props}
        />
      </View>
      {error ? (
        <Typography style={[styles.errorText, { color: colors.error }]}>{error}</Typography>
      ) : null}

      <Modal
        transparent
        visible={pickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={[styles.overlay, { backgroundColor: colors.modalBackdrop }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerVisible(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <Typography style={[styles.sheetTitle, { color: colors.text }]}>
              Select country
            </Typography>
            {COUNTRIES.map((c) => {
              const selected = c.code === country;
              return (
                <Pressable
                  key={c.code}
                  onPress={() => handlePick(c.code)}
                  style={({ pressed }) => [
                    styles.optionRow,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primarySubtle : colors.background,
                    },
                    pressed && styles.optionRowPressed,
                  ]}
                >
                  <Typography style={styles.optionFlag}>{c.flag}</Typography>
                  <View style={styles.optionTextWrap}>
                    <Typography style={[styles.optionLabel, { color: colors.text }]}>
                      {c.label}
                    </Typography>
                    <Typography style={[styles.optionDial, { color: colors.textSecondary }]}>
                      {c.dialCode}
                    </Typography>
                  </View>
                  {selected ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
    borderRightWidth: 1,
  },
  flag: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  errorText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: 'right',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sheetTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  optionRowPressed: {
    opacity: 0.78,
  },
  optionFlag: {
    fontSize: 22,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  optionDial: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
});
