import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImagePreviewModal } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useTrainer } from '../hooks/useTrainer';
import { useTrainerImages } from '../hooks/useTrainerImages';

export function TrainerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { trainerId } = useLocalSearchParams<{ trainerId?: string }>();
  const { data: trainer, isLoading, isError, refetch } = useTrainer(trainerId);
  const { data: galleryImages = [] } = useTrainerImages(trainerId);
  const [tab, setTab] = useState('Coach');
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <ActivityIndicator color="#005F86" />
      </View>
    );
  }

  if (!trainer) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background, padding: 24 }]}>
        <StatusBar style="light" />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {isError ? 'Unable to load trainer' : 'Trainer not found'}
        </Text>
        <Pressable style={styles.secondaryBtn} onPress={() => (isError ? refetch() : router.back())}>
          <Text style={styles.secondaryText}>{isError ? 'Try Again' : 'Go Back'}</Text>
        </Pressable>
      </View>
    );
  }

  const visibleGalleryImages =
    galleryImages.length > 0
      ? galleryImages
      : [
          { id: 'trainer-image', imageUrl: trainer.image, position: 0 },
          { id: 'trainer-cover', imageUrl: trainer.coverImage, position: 1 },
          { id: 'trainer-image-repeat', imageUrl: trainer.image, position: 2 },
        ];

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
        <Animated.View entering={FadeIn.duration(420)} style={styles.hero}>
          <Animated.Image
            entering={FadeIn.duration(520)}
            source={{ uri: trainer.coverImage }}
            style={styles.cover}
          />
          <Animated.View
            entering={ZoomIn.delay(180).duration(380)}
            style={[styles.avatar, { borderColor: colors.background }]}
          >
            <Pressable
              onPress={() => setExpandedImageIndex(0)}
              style={styles.avatarPressable}
              accessibilityRole="imagebutton"
              accessibilityLabel="View trainer display picture"
            >
              <Image source={{ uri: trainer.image }} style={styles.avatarImage} />
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* CONTENT */}
        <View style={styles.info}>
          <Animated.View entering={FadeInDown.delay(80).duration(380)}>
            <Text style={[styles.name, { color: colors.text }]}>{trainer.name}</Text>
            <Text style={[styles.role, { color: colors.textSecondary }]}>
              {trainer.specialty} · {trainer.experience}
            </Text>
          </Animated.View>

          {/* STATS */}
          <Animated.View
            entering={FadeInUp.delay(140).duration(420)}
            style={[styles.stats, { borderBottomColor: colors.divider }]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Exp</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>{trainer.experience}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Clients</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>{trainer.clients}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>Rating</Text>
              <Text style={[styles.statNumber, { color: colors.text }]}>{trainer.rating}</Text>
            </View>
          </Animated.View>

          {/* TABS */}
          <Animated.View
            entering={FadeInUp.delay(220).duration(420)}
            style={[styles.tabs, { backgroundColor: colors.surfaceMuted }]}
          >
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
          </Animated.View>

          {/* COACH TAB */}
          {tab === 'Coach' && (
            <Animated.View key="Coach" entering={FadeInUp.duration(360)}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About {trainer.name}
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {trainer.bio}
              </Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Training Style</Text>
              <View style={styles.trainingStyles}>
                {(trainer.trainingStyles.length > 0 ? trainer.trainingStyles : trainer.tags).map(
                  (style) => (
                    <View
                      key={style}
                      style={[
                        styles.trainingStylePill,
                        { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.trainingStyleText, { color: colors.textSecondary }]}>
                        {style}
                      </Text>
                    </View>
                  ),
                )}
              </View>
              <View style={styles.gallery}>
                {visibleGalleryImages.slice(0, 5).map((image, index) => (
                  <Pressable
                    key={image.id}
                    style={styles.galleryImage}
                    onPress={() => setExpandedImageIndex(index + 1)}
                  >
                    <Image source={{ uri: image.imageUrl }} style={styles.galleryImageInner} />
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                See Trainer In Action
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(main)/trainer-video',
                    params: {
                      returnTo: 'trainer-profile',
                      trainerId: trainer.id,
                      videoUrl: trainer.videoUrl,
                    },
                  } as never)
                }
                style={styles.videoWrap}
              >
                <Image source={{ uri: trainer.image }} style={styles.video} />
                <View style={styles.videoOverlay} />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={22} color="#0F2E5C" />
                </View>
              </Pressable>
            </Animated.View>
          )}

          {/* BENEFITS TAB */}
          {tab === 'Benefits' && (
            <Animated.View key="Benefits" entering={FadeInUp.duration(360)}>
              {trainer.benefits.map((item) => (
                <View
                  key={item.id}
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
            </Animated.View>
          )}

          {/* RATINGS TAB */}
          {tab === 'Ratings' && (
            <Animated.View key="Ratings" entering={FadeInUp.duration(360)}>
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
            </Animated.View>
          )}

          {/* BUTTONS */}
          <Animated.View entering={FadeInUp.delay(300).duration(420)}>
            <Pressable
              style={styles.primaryBtn}
              onPress={() =>
                router.push({
                  pathname: '/book-a-session',
                  params: { trainerId: trainer.id },
                } as never)
              }
            >
              <Text style={styles.primaryText}>Work With {trainer.name.split(' ')[0]}</Text>
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
          </Animated.View>
        </View>
      </ScrollView>
      <ImagePreviewModal
        images={[
          { id: 'trainer-display-picture', imageUrl: trainer.image },
          ...visibleGalleryImages.slice(0, 5),
        ]}
        index={expandedImageIndex}
        onClose={() => setExpandedImageIndex(null)}
        onChangeIndex={setExpandedImageIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
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
    overflow: 'hidden',
    backgroundColor: '#DCE7FF',
  },
  avatarPressable: {
    flex: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  trainingStyles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  trainingStylePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  trainingStyleText: { fontSize: 11, fontWeight: '700' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryImage: { width: '31%', height: 70, borderRadius: 10, overflow: 'hidden' },
  galleryImageInner: { width: '100%', height: '100%' },
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
