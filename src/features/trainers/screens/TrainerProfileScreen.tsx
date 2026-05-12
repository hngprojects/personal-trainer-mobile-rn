import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { trainers } from '../data/trainers.data';

export function TrainerProfileScreen() {
  const trainer = trainers[0];

  const [tab, setTab] = useState('Coach');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image source={{ uri: trainer.coverImage }} style={styles.cover} />

        <Image source={{ uri: trainer.image }} style={styles.avatar} />
      </View>

      {/* CONTENT */}
      <View style={styles.info}>
        <Text style={styles.name}>Charles Effiong</Text>

        <Text style={styles.role}>Coach · More · 7 yrs</Text>

        {/* STATS */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Exp</Text>

            <Text style={styles.statNumber}>5+</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>Clients</Text>

            <Text style={styles.statNumber}>37</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>Rating</Text>

            <Text style={styles.statNumber}>4.8</Text>
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {['Coach', 'Benefits', 'Ratings'].map((item) => (
            <Pressable
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tabButton, tab === item && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === item && styles.activeText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        {/* COACH TAB */}
        {tab === 'Coach' && (
          <>
            <Text style={styles.sectionTitle}>About Charles Effiong</Text>

            <Text style={styles.description}>
              I help busy clients build stronger bodies through custom fitness coaching, nutrition
              planning and consistency.
            </Text>

            <Text style={styles.sectionTitle}>Training Style</Text>

            <View style={styles.gallery}>
              <Image
                source={{
                  uri: trainer.image,
                }}
                style={styles.galleryImage}
              />

              <Image
                source={{
                  uri: trainer.coverImage,
                }}
                style={styles.galleryImage}
              />

              <Image
                source={{
                  uri: trainer.image,
                }}
                style={styles.galleryImage}
              />
            </View>

            {/* VIDEO */}
            <Text style={styles.sectionTitle}>See Trainer In Action</Text>

            <Pressable onPress={() => router.push('/trainer-video')}>
              <Image
                source={{
                  uri: trainer.image,
                }}
                style={styles.video}
              />
            </Pressable>
          </>
        )}

        {/* BENEFITS TAB */}
        {tab === 'Benefits' && (
          <>
            {[
              {
                title: 'Personalized Training Plans',
                text: 'Custom coaching designed for your goals.',
              },
              {
                title: 'Real Accountability',
                text: 'Weekly check-ins and consistent support.',
              },
              {
                title: 'Proven Results',
                text: 'Track measurable transformation progress.',
              },
              {
                title: 'Structured Progression',
                text: 'Clear systems that help you improve.',
              },
            ].map((item) => (
              <View key={item.title} style={styles.benefitCard}>
                <View style={styles.iconWrapper}>
                  <View style={styles.iconInner} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>

                  <Text style={styles.benefitText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* RATINGS TAB */}
        {tab === 'Ratings' && (
          <>
            <View style={styles.ratingHeader}>
              <Text style={styles.sectionTitle}>Trainer Ratings</Text>

              <Text style={styles.mostRecent}>Most Recent</Text>
            </View>

            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.ratingCard}>
                <View style={styles.ratingTop}>
                  <View style={styles.userAvatar} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>Sarah Adams</Text>

                    <Text style={styles.reviewDate}>2 days ago</Text>
                  </View>

                  <Text style={styles.star}>⭐ 4.5</Text>
                </View>

                <Text style={styles.reviewText}>
                  Charles helped me stay disciplined and finally hit my fitness goals.
                </Text>
              </View>
            ))}
          </>
        )}

        {/* BUTTONS */}
        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Work With Charles</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Request a Call</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  hero: {
    height: 170,
  },

  cover: {
    width: '100%',
    height: 120,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 8,
  },

  info: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  name: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },

  role: {
    textAlign: 'center',
    color: '#888',
    marginTop: 4,
    fontSize: 11,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    color: '#999',
    fontSize: 11,
  },

  statNumber: {
    marginTop: 4,
    fontWeight: '700',
    fontSize: 14,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 18,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#0D6EFD',
  },

  tabText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 12,
    fontWeight: '600',
  },

  activeText: {
    color: '#fff',
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontWeight: '700',
    fontSize: 13,
  },

  description: {
    fontSize: 11,
    color: '#666',
    lineHeight: 18,
  },

  gallery: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  galleryImage: {
    width: '31%',
    height: 70,
    borderRadius: 10,
  },

  video: {
    width: '100%',
    height: 180,
    borderRadius: 14,
  },

  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconInner: {
    width: 18,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#DCE7FF',
  },

  benefitCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  benefitTitle: {
    fontWeight: '700',
    fontSize: 12,
  },

  benefitText: {
    color: '#888',
    fontSize: 10,
    marginTop: 4,
  },

  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  mostRecent: {
    color: '#999',
    fontSize: 10,
  },

  ratingCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },

  ratingTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DDD',
    marginRight: 10,
  },

  userName: {
    fontWeight: '700',
    fontSize: 12,
  },

  reviewDate: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
  },

  star: {
    color: '#F4A100',
    fontSize: 12,
    fontWeight: '700',
  },

  reviewText: {
    color: '#777',
    fontSize: 11,
    marginTop: 10,
    lineHeight: 18,
  },

  primaryBtn: {
    backgroundColor: '#005F86',
    marginTop: 20,
    paddingVertical: 13,
    borderRadius: 8,
  },

  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#005F86',
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 8,
  },

  secondaryText: {
    color: '#005F86',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 12,
  },
});
