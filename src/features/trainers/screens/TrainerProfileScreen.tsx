import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { trainers } from '../data/trainers.data';

export function TrainerProfileScreen() {
  const insets = useSafeAreaInsets();
  const trainer = trainers[0];
  const [tab, setTab] = useState('Coach');
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Back button respects the top safe-area inset so it doesn't sit under the notch. */}
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={[styles.backButton, { top: insets.top + 12 }]}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO — cover image extends edge-to-edge under the status bar */}
        <View style={styles.hero}>
          <Image source={{ uri: trainer.coverImage }} style={styles.cover} />
          <Image
            source={{ uri: trainer.image }}
            style={[styles.avatar, { borderColor: colors.background }]}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>Charles Effiong</Text>
          <Text style={[styles.role, { color: colors.textSecondary }]}>Coach · More · 7 yrs</Text>

          {/* STATS */}
          <View style={[styles.stats, { borderBottomColor: colors.divider }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Exp</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>5+</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Clients</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>37</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Rating</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>4.8</Text>
            </View>
          </View>

          {/* TABS */}
          <View style={[styles.tabs, { backgroundColor: colors.surfaceMuted }]}>
            {['Coach', 'Benefits', 'Ratings'].map((item) => (
              <Pressable
                key={item}
                onPress={() => setTab(item)}
                style={[styles.tabButton, tab === item && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.textSecondary },
                    tab === item && styles.activeText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* COACH TAB */}
          {tab === 'Coach' && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About Charles Effiong
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                I help busy clients build stronger bodies through custom fitness coaching, nutrition
                planning and consistency.
              </Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Training Style</Text>
              <View style={styles.gallery}>
                <Image source={{ uri: trainer.image }} style={styles.galleryImage} />
                <Image source={{ uri: trainer.coverImage }} style={styles.galleryImage} />
                <Image source={{ uri: trainer.image }} style={styles.galleryImage} />
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                See Trainer In Action
              </Text>
              <Pressable onPress={() => router.push('/trainer-video')} style={styles.videoWrap}>
                <Image source={{ uri: trainer.image }} style={styles.video} />
                <View style={styles.videoOverlay} />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={22} color="#0F2E5C" />
                </View>
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
                { title: 'Real Accountability', text: 'Weekly check-ins and consistent support.' },
                { title: 'Proven Results', text: 'Track measurable transformation progress.' },
                { title: 'Structured Progression', text: 'Clear systems that help you improve.' },
              ].map((item) => (
                <View
                  key={item.title}
                  style={[styles.benefitCard, { backgroundColor: colors.surface }]}
                >
                  <View style={styles.iconWrapper}>
                    <View style={styles.iconInner} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.benefitTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* RATINGS TAB */}
          {tab === 'Ratings' && (
            <>
              <View style={styles.ratingHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Trainer Ratings</Text>
                <Text style={[styles.mostRecent, { color: colors.textSecondary }]}>
                  Most Recent
                </Text>
              </View>

              {[1, 2, 3].map((item) => (
                <View key={item} style={[styles.ratingCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.ratingTop}>
                    <View style={[styles.userAvatar, { backgroundColor: colors.surfaceMuted }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewer, { color: colors.text }]}>Sarah Adams</Text>
                      <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
                        2 days ago
                      </Text>
                    </View>
                    <Text style={styles.star}>⭐ 4.5</Text>
                  </View>
                  <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
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
          <Pressable
            style={styles.secondaryBtn}
            onPress={() =>
              router.push({
                pathname: '/book-a-call',
                params: { trainerId: trainer.id },
              } as never)
            }
          >
            <Text style={styles.secondaryText}>Request a Call</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { height: 290 },
  cover: { width: '100%', height: 240 },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 3,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 8,
  },
  info: { paddingHorizontal: 16 },
  name: { textAlign: 'center', fontWeight: '700', fontSize: 18 },
  role: { textAlign: 'center', marginTop: 4, fontSize: 11 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 11 },
  statNumber: { marginTop: 4, fontWeight: '700', fontSize: 14 },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    marginTop: 18,
    padding: 4,
  },
  tabButton: { flex: 1, paddingVertical: 10, borderRadius: 10 },
  activeTab: { backgroundColor: '#0D6EFD' },
  tabText: { textAlign: 'center', fontSize: 12, fontWeight: '600' },
  activeText: { color: '#fff' },
  sectionTitle: { marginTop: 18, marginBottom: 10, fontWeight: '700', fontSize: 13 },
  description: { fontSize: 11, lineHeight: 18 },
  gallery: { flexDirection: 'row', justifyContent: 'space-between' },
  galleryImage: { width: '31%', height: 70, borderRadius: 10 },
  videoWrap: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: { width: '100%', height: 180, borderRadius: 14 },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playButton: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
  iconInner: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#DCE7FF' },
  benefitCard: {
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitTitle: { fontWeight: '700', fontSize: 12 },
  benefitText: { fontSize: 10, marginTop: 4 },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  mostRecent: { fontSize: 10 },
  ratingCard: { borderRadius: 14, padding: 14, marginTop: 10 },
  ratingTop: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  reviewer: { fontWeight: '700', fontSize: 12 },
  reviewDate: { fontSize: 10, marginTop: 2 },
  star: { color: '#F4A100', fontSize: 12, fontWeight: '700' },
  reviewText: { fontSize: 11, marginTop: 10, lineHeight: 18 },
  primaryBtn: { backgroundColor: '#005F86', marginTop: 20, paddingVertical: 13, borderRadius: 8 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 12 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#005F86',
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 8,
  },
  secondaryText: { color: '#005F86', textAlign: 'center', fontWeight: '700', fontSize: 12 },
});
