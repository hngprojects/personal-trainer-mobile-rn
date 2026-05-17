import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

interface Props {
  avatars: string[];
  totalClients: number;
  size?: number;
  maxVisible?: number;
}

export function ClientAvatarStack({ avatars, totalClients, size = 22, maxVisible = 4 }: Props) {
  const visible = avatars.slice(0, maxVisible);
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.stack}>
        {visible.map((uri, i) => (
          <Image
            key={`${uri}-${i}`}
            source={{ uri }}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: i === 0 ? 0 : -size / 2.4,
                zIndex: visible.length - i,
                borderColor: colors.background,
                backgroundColor: colors.surfaceMuted,
              },
            ]}
          />
        ))}
      </View>
      <Typography style={[styles.count, { color: colors.textSecondary }]}>
        {totalClients}+ Clients
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stack: {
    flexDirection: 'row',
  },
  avatar: {
    borderWidth: 1.5,
  },
  count: {
    fontSize: 10,
    fontFamily: fonts.regular,
  },
});
