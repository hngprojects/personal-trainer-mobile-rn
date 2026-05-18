import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export function TrainerCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.divider }]}
    >
      <Skeleton width="100%" height={130} borderRadius={0} />

      <View style={styles.body}>
        <View style={styles.tags}>
          <Skeleton width={40} height={18} borderRadius={999} />
          <Skeleton width={52} height={18} borderRadius={999} />
          <Skeleton width={48} height={18} borderRadius={999} />
        </View>

        <View style={styles.nameRow}>
          <Skeleton width="60%" height={14} />
          <Skeleton width={30} height={12} />
        </View>

        <View style={styles.footer}>
          <View style={styles.avatars}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width={22}
                height={22}
                borderRadius={11}
                style={{ marginLeft: i === 0 ? 0 : -9 }}
              />
            ))}
          </View>
          <Skeleton width={70} height={10} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  body: {
    padding: 8,
    gap: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatars: {
    flexDirection: 'row',
  },
});
