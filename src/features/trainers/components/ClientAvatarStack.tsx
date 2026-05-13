import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

interface Props {
  avatars: string[];
  totalClients: number;
  size?: number;
  maxVisible?: number;
}

export function ClientAvatarStack({ avatars, totalClients, size = 22, maxVisible = 4 }: Props) {
  const visible = avatars.slice(0, maxVisible);

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
              },
            ]}
          />
        ))}
      </View>
      <Typography style={styles.count}>{totalClients}+ Clients</Typography>
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
    borderColor: '#FFFFFF',
    backgroundColor: palette.neutral['1'],
  },
  count: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
  },
});
