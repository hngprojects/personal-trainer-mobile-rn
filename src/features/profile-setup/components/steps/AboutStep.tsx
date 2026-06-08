import { Ionicons } from '@expo/vector-icons';
import { VideoView } from 'expo-video';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SharedValue } from 'react-native-reanimated';

import { FALLBACK_VIDEO_URL, useMediaVideos, useSequentialVideoPlayer } from '@/features/media';
import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

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

// Isolated so the card can remount it (via `key`) when the resolved source list
// changes — the sequential player only reads its sources on first construction.
function AboutStepVideo({ sources }: { sources: string[] }) {
  const player = useSequentialVideoPlayer(sources, { autoPlay: false });

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      allowsPictureInPicture
      // `contain` so the whole frame is always visible — the trainer videos are
      // portrait and `cover` was cropping the top/bottom, cutting off the face.
      contentFit="contain"
    />
  );
}

export function AboutStep({ index, scrollX, slideWidth }: AboutStepProps) {
  const { colors } = useTheme();
  const { data: videos } = useMediaVideos();

  // Play through every ready video from the org media library; placeholder
  // while the request is loading or empty so the card is never black.
  const sources = videos?.length ? videos.map((item) => item.url) : [FALLBACK_VIDEO_URL];

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <Animated.View entering={FadeInUp.delay(80).duration(420)} style={styles.videoCard}>
        <AboutStepVideo key={sources.join('|')} sources={sources} />
      </Animated.View>

      <View style={styles.highlights}>
        {HIGHLIGHTS.map((h, i) => (
          <Animated.View
            key={h.title}
            entering={FadeInDown.delay(180 + i * 100).duration(360)}
            style={styles.highlightRow}
          >
            <Ionicons name="checkmark" size={18} color={palette.success['5']} />
            <Typography style={[styles.highlightTitle, { color: colors.text }]}>
              {h.title}
            </Typography>
          </Animated.View>
        ))}
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    // Portrait card so the (portrait) trainer videos fill it with minimal bars;
    // aspectRatio scales to the device width. `contain` keeps faces uncropped.
    width: '100%',
    aspectRatio: 3 / 4,
    maxHeight: 420,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  highlights: {
    marginTop: 20,
    gap: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  highlightTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
});
