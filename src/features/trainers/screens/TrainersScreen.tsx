import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { trainers } from '../data/trainers.data';

export function TrainersScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hi, Good Morning!
          </Text>

          <Text style={styles.userName}>
            Mark Anthony
          </Text>
        </View>

        <Image
          source={{
            uri: 'https://randomuser.me/api/portraits/men/32.jpg',
          }}
          style={styles.avatar}
        />
      </View>

      {/* HERO */}
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>
            Train with Purpose
          </Text>

          <Text style={styles.heroText}>
            Achieve your dream body with
            expert trainers.
          </Text>

          <Pressable style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>
              Train Quick →
            </Text>
          </Pressable>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
          }}
          style={styles.heroImage}
        />
      </View>

      {/* CATEGORIES */}
      <Text style={styles.sectionTitle}>
        Categories
      </Text>

      <View style={styles.categories}>
        {[
          'Gym',
          'Yoga',
          'Boxing',
          'Cardio',
          'Crossfit',
        ].map((item) => (
          <View
            key={item}
            style={styles.categoryItem}>
            <View
              style={styles.circle}
            />

            <Text
              style={
                styles.categoryText
              }>
              {item}
            </Text>
          </View>
        ))}
      </View>

      {/* TRAINERS */}
      <Text style={styles.sectionTitle}>
        Trainers
      </Text>

      <View style={styles.trainersGrid}>
        {trainers
          .slice(0, 4)
          .map((trainer) => (
            <Pressable
              key={trainer.id}
              style={styles.card}
              onPress={() =>
                router.push(
                  '/trainer-profile',
                )
              }>
              <Image
                source={{
                  uri: trainer.image,
                }}
                style={
                  styles.cardImage
                }
              />

              <View
                style={styles.cardBody}>
                <Text
                  style={
                    styles.cardName
                  }>
                  {trainer.name}
                </Text>

                <Text
                  style={
                    styles.cardRole
                  }>
                  Strength Coach
                </Text>

                <View
                  style={
                    styles.bottomRow
                  }>
                  <Text
                    style={
                      styles.rating
                    }>
                    ⭐ 4.8
                  </Text>

                  <Text
                    style={
                      styles.price
                    }>
                    ₦10k
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
  },

  header: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 12,
    color: '#9A9A9A',
  },

  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    color: '#111',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  heroCard: {
    marginTop: 22,
    backgroundColor: '#EEF4FA',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroLeft: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },

  heroText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },

  heroBtn: {
    backgroundColor: '#005F86',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },

  heroBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },

  heroImage: {
    width: 95,
    height: 115,
    borderRadius: 16,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  categories: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  categoryItem: {
    alignItems: 'center',
  },

  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F1F1',
    marginBottom: 8,
  },

  categoryText: {
    fontSize: 11,
    color: '#777',
  },

  trainersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    paddingBottom: 40,
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },

  cardImage: {
    width: '100%',
    height: 110,
  },

  cardBody: {
    padding: 10,
  },

  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  cardRole: {
    fontSize: 10,
    color: '#8A8A8A',
    marginTop: 3,
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  rating: {
    fontSize: 11,
    color: '#333',
  },

  price: {
    fontSize: 12,
    fontWeight: '700',
    color: '#005F86',
  },
});