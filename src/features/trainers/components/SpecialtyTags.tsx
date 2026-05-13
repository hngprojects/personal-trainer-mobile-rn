import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

interface Props {
  tags: string[];
}

export function SpecialtyTags({ tags }: Props) {
  return (
    <View style={styles.row}>
      {tags.map((tag) => (
        <View key={tag} style={styles.pill}>
          <Typography style={styles.label}>{tag}</Typography>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  pill: {
    backgroundColor: palette.highlightBlue['0.5'],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.semibold,
    color: palette.highlightBlue['7'],
  },
});
