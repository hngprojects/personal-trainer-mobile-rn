import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SharedValue } from 'react-native-reanimated';

import { Typography } from '@/shared/components';
import { fonts, palette } from '@/shared/theme';

import { StepShell } from '../StepShell';

interface AboutStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

const HIGHLIGHTS = [
  { title: 'Customized Plans' },
  { title: 'Real-Time Support' },
  { title: 'Flexible Workouts' },
];

const VIDEO_THUMBNAIL =
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format&q=70';

export function AboutStep({ index, scrollX, slideWidth }: AboutStepProps) {
  const openVideo = () => router.push('/profile-setup-video' as Href);

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <Typography style={styles.subtitle}>
        Our expert trainers will guide you every step of the way
      </Typography>

      <Animated.View entering={FadeInUp.delay(80).duration(420)} style={styles.videoCard}>
        <Pressable onPress={openVideo} style={styles.videoPressable}>
          <Image source={{ uri: VIDEO_THUMBNAIL }} style={styles.videoImage} />
          <View style={styles.videoOverlay} />
          <View style={styles.playButton}>
            <Ionicons name="play" size={22} color={palette.neutral['9']} />
          </View>
        </Pressable>
      </Animated.View>

      <View style={styles.highlights}>
        {HIGHLIGHTS.map((h, i) => (
          <Animated.View
            key={h.title}
            entering={FadeInDown.delay(180 + i * 100).duration(360)}
            style={styles.highlightRow}
          >
            <Ionicons name="checkmark" size={18} color={palette.success['5']} />
            <Typography style={styles.highlightTitle}>{h.title}</Typography>
          </Animated.View>
        ))}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    lineHeight: 20,
    marginBottom: 20,
  },
  videoCard: {
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
  },
  videoPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlights: {
    marginTop: 20,
    gap: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: palette.neutral['0.5'],
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
  highlightTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: palette.neutral['9'],
  },
});
