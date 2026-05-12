import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Trainer } from '../types/trainer.types';

interface Props {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => router.push('/trainer-profile')}>
      <Image source={{ uri: trainer.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{trainer.name}</Text>

        <Text style={styles.specialty}>{trainer.specialty}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.rating}>⭐ {trainer.rating}</Text>

          <Text style={styles.price}>₦10k</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
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
    color: '#777',
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
    color: '#0D6EFD',
    fontWeight: '700',
    fontSize: 13,
  },
});
