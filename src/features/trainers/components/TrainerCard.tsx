import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, useTheme } from '@/shared/theme';

import { Trainer } from '../types/trainer.types';

interface Props {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={() => router.push('/trainer-profile')}
    >
      <Image source={{ uri: trainer.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{trainer.name}</Text>

        <Text style={[styles.specialty, { color: colors.textSecondary }]}>{trainer.specialty}</Text>

        <View style={styles.bottomRow}>
          <Text style={[styles.rating, { color: colors.text }]}>⭐ {trainer.rating}</Text>

          <Text style={[styles.price, { color: palette.highlightBlue['5'] }]}>₦10k</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
  },

  image: {
    width: '100%',
    height: 120,
  },

  content: {
    padding: 10,
  },

  name: {
    fontWeight: '700',
    fontSize: 13,
  },

  specialty: {
    fontSize: 11,
    marginTop: 2,
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rating: {
    fontSize: 12,
    fontWeight: '600',
  },

  price: {
    fontWeight: '700',
    fontSize: 13,
  },
});
