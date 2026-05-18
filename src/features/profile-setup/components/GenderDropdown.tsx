import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import type { Gender } from '../types/profile-setup.types';

interface GenderDropdownProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
  label?: string;
  placeholder?: string;
}

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export function GenderDropdown({
  value,
  onChange,
  label = 'Gender',
  placeholder = 'select gender',
}: GenderDropdownProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const selectedLabel = OPTIONS.find((o) => o.value === value)?.label;

  const handleSelect = (next: Gender) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Typography style={[styles.label, { color: colors.text }]}>{label}</Typography>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          { borderColor: colors.border, backgroundColor: colors.inputBackground },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Typography
          style={[styles.value, { color: selectedLabel ? colors.text : colors.textSecondary }]}
        >
          {selectedLabel ?? placeholder}
        </Typography>
        <Ionicons name="chevron-down" size={18} color={colors.iconMuted} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.menu,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            {OPTIONS.map((opt) => {
              const selected = opt.value === value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => handleSelect(opt.value)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && { backgroundColor: palette.highlightBlue['5'] },
                    pressed && !selected && { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Typography
                    style={[styles.optionText, { color: selected ? '#FFFFFF' : colors.text }]}
                  >
                    {opt.label}
                  </Typography>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  value: {
    fontSize: 14,
    fontFamily: fonts.regular,
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  menu: {
    width: '100%',
    maxWidth: 220,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
});
