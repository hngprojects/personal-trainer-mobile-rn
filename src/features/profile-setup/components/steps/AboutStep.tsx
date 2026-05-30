import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SharedValue } from 'react-native-reanimated';

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

const VIDEO_SOURCE = 'https://videos.pexels.com/video-files/5528012/5528012-hd_1080_1920_25fps.mp4';

export function AboutStep({ index, scrollX, slideWidth }: AboutStepProps) {
  const { colors } = useTheme();
  const videoRef = useRef<VideoView>(null);
  const player = useVideoPlayer(VIDEO_SOURCE, (instance) => {
    instance.loop = false;
  });

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth}>
      <Animated.View entering={FadeInUp.delay(80).duration(420)} style={styles.videoCard}>
        <VideoView
          ref={videoRef}
          player={player}
          style={styles.video}
          nativeControls
          allowsPictureInPicture
          contentFit="cover"
        />
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
    height: 200,
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
